import { each } from 'lodash';

import { IBook, IBookRow, BookMode, Order } from '../types';

export type OnDataCB = (value: Pick<IBook, BookMode>) => void;

type ChannelParams = { pair: string; prec: string };

export class OrderBookChannel {
  private params: ChannelParams;
  private ws: WebSocket;
  private bids: Order = {};
  private asks: Order = {};
  private chanId: string | null = null;
  private isFirstUpdate = true;

  private onDataCb: OnDataCB | null = null;

  public constructor(ws: WebSocket, params: ChannelParams) {
    this.ws = ws;
    this.params = params;
    this.ws.onmessage = this.onMessage;
  }

  public onData(cb: OnDataCB) {
    this.onDataCb = cb;
  }

  public subscribe() {
    this.ws.send(
      JSON.stringify({
        pair: this.params.pair,
        prec: this.params.prec,
        event: 'subscribe',
        channel: 'book',
      }),
    );
  }

  public unsubscribe() {
    //if already successfully subscribed, then unsubscribe
    if (this.chanId) {
      this.unsubscribeIfWSOpen(this.chanId);
    }
    //if this.chanId is null it means we haven't got the response of the subscribe call yet,
    //and will handle the unsubscription later in onMessage callback
  }

  private unsubscribeIfWSOpen(chanId: string) {
    if (this.isWSOpen()) {
      this.ws.send(
        JSON.stringify({
          event: 'unsubscribe',
          chanId,
        }),
      );
    }
  }

  private isWSOpen() {
    return this.ws.readyState === this.ws.OPEN;
  }

  private onMessage = ({ data }: MessageEvent<any>) => {
    const chunk = JSON.parse(data);
    if (chunk.event) {
      if (chunk.event === 'subscribed') {
        //if already subscribed for this channel or some other channel response came back, then unsubscribe
        if (this.chanId || !this.isSameChannelParmas(chunk)) {
          return this.unsubscribeIfWSOpen(chunk.chanId);
        }
        this.chanId = chunk.chanId;
      }
      return;
    }
    if (chunk[1] === 'hb' || chunk[1] === 'cs') return;

    const chunkChannelId = chunk[0];
    if (!this.chanId || this.chanId !== chunkChannelId) {
      return;
    }

    if (this.isFirstUpdate) {
      each(chunk[1], ([price, cnt, amount]) =>
        this.storeBookRow({ price, cnt, amount }),
      );
      this.isFirstUpdate = false;
    } else {
      const [price, cnt, amount] = chunk[1];
      if (cnt) this.storeBookRow({ price, cnt, amount });
      else this.removeBookRow({ price, cnt, amount });
    }

    this.onDataCb?.({
      bids: { ...this.bids },
      asks: { ...this.asks },
    });
  };

  private storeBookRow(row: IBookRow) {
    const side = row.amount >= 0 ? 'bids' : 'asks';
    row.amount = Math.abs(row.amount);
    this[side][row.price] = row;
  }

  private removeBookRow(row: IBookRow) {
    const book = row.amount > 0 ? this.bids : this.asks;
    delete book[row.price];
  }

  private isSameChannelParmas(chunkParams: ChannelParams) {
    return (
      this.params.pair === chunkParams.pair &&
      this.params.prec === chunkParams.prec
    );
  }
}
