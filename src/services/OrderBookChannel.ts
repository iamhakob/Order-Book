import CRC from 'crc-32';
import _ from 'lodash';

import { IBook, IBookRow, BookMode } from '../types';

const SOCKET_URL = 'wss://api-pub.bitfinex.com/ws/2';

export type OnDataCB = (value: Pick<IBook, BookMode>) => void;

type Order = { [key: string]: IBookRow };

type Psnap = { [key in BookMode]?: string[] };

export class OrderBookChannel {
  private ws: WebSocket | null = null;
  private bids: Order = {};
  private asks: Order = {};
  private psnap: Psnap = {};
  private mcnt = 0;

  private onDataCb: OnDataCB | null = null;

  public onData(cb: OnDataCB) {
    this.onDataCb = cb;
  }

  public init({ pair, prec }: { pair: string; prec: string }) {
    this.ws = new WebSocket(SOCKET_URL);

    this.ws.onopen = this.onWsOpen(pair, prec);
    this.ws.onmessage = this.onMessage;
  }

  public closeChannel() {
    if (!this.ws) return;

    if (this.ws.readyState === this.ws.CONNECTING) {
      this.ws.onopen = () => this.ws?.close();
    } else {
      this.ws.close()
    }
  }

  private resetBook() {
    this.bids = {};
    this.asks = {};
    this.psnap = {};
    this.mcnt = 0;
  }

  private onWsOpen(pair: string, prec: string) {
    return () => {
      this.resetBook();
      this.ws?.send(JSON.stringify({ event: 'conf', flags: 131072 }));
      this.ws?.send(
        JSON.stringify({
          pair,
          prec,
          event: 'subscribe',
          channel: 'book',
        }),
      );
    };
  }

  // found this code that handles the data processing in the docomentation
  // here: https://blog.bitfinex.com/api/bitfinex-api-order-books-checksums/
  private onMessage = ({ data }: MessageEvent<any>) => {
    let msg = JSON.parse(data);
    if (msg.event) return;
    if (msg[1] === 'hb') return;

    if (msg[1] === 'cs') {
      const checksum = msg[2];
      const csdata = [];
      const bidsKeys = this.psnap.bids;
      const asksKeys = this.psnap.asks;

      for (let i = 0; i < 25; i++) {
        if (bidsKeys && bidsKeys[i]) {
          const price = bidsKeys[i];
          const pp = this.bids[price];
          csdata.push(pp.price, pp.amount);
        }
        if (asksKeys && asksKeys[i]) {
          const price = asksKeys[i];
          const pp = this.asks[price];
          csdata.push(pp.price, -pp.amount);
        }
      }

      const csStr = csdata.join(':');
      const csCalc = CRC.str(csStr);
      if (csCalc !== checksum) {
        console.error('CHECKSUM_FAILED');
      }
      return;
    }

    if (this.mcnt === 0) {
      _.each(msg[1], (pp) => {
        pp = { price: pp[0], cnt: pp[1], amount: pp[2] };
        const side = pp.amount >= 0 ? 'bids' : 'asks';
        pp.amount = Math.abs(pp.amount);
        this[side][pp.price] = pp;
      });
    } else {
      msg = msg[1];
      const pp = { price: msg[0], cnt: msg[1], amount: msg[2] };
      if (!pp.cnt) {
        let found = true;

        if (pp.amount > 0) {
          if (this.bids[pp.price]) {
            delete this.bids[pp.price];
          } else {
            found = false;
          }
        } else if (pp.amount < 0) {
          if (this.asks[pp.price]) {
            delete this.asks[pp.price];
          } else {
            found = false;
          }
        }

        if (!found) {
          console.error('Book delete failed. Price point not found');
        }
      } else {
        const side = pp.amount >= 0 ? 'bids' : 'asks';
        pp.amount = Math.abs(pp.amount);
        this[side][pp.price] = pp;
      }

      _.each(['bids', 'asks'], (side: 'bids' | 'asks') => {
        const sbook = this[side];
        const bprices = Object.keys(sbook);
        const prices = bprices.sort((a, b) => {
          if (side === 'bids') {
            return +a >= +b ? -1 : 1;
          }
          return +a <= +b ? -1 : 1;
        });
        this.psnap[side] = prices;
      });
    }
    this.mcnt++;

    const bids = Object.values(this.bids) as IBookRow[];
    // to have the correct order
    bids.reverse();
    this.onDataCb?.({
      bids,
      asks: Object.values(this.asks),
    });
  };
}
