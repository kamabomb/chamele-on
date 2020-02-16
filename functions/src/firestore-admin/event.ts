/* eslint-disable @typescript-eslint/no-non-null-assertion */
import admin from 'firebase-admin';
import { parseFromTimeZone } from 'date-fns-timezone';

import { collectionName } from '../services/chamele-on/constants';
import { FeedMemo } from '../services/chamele-on/models/feed-memo';
import { Event, blankEvent } from '../services/chamele-on/models/event';
import { addCounter } from './record-counter';

export const createEvent = async (
  db: admin.firestore.Firestore,
  memo: FeedMemo,
) => {
  const title = memo.title ?? '';
  const subTitle = memo.subTitle ?? '';
  const url = memo.url ?? '';

  const date = parseFromTimeZone(memo.date, { timeZone: 'Asia/Tokyo' });
  const tDate = admin.firestore.Timestamp.fromDate(date);

  const event: Event = {
    ...blankEvent,
    eventId,
    title,
    subTitle,
    url,
    thumbnail,
    place,
    address,
    prefecture,
    date: tDate,
  };

  const eventsRef = db.collection(collectionName.events);
  await eventsRef.doc(event.eventId).set({
    ...event,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  await addCounter(db, collectionName.events);

  return { ...event, id: eventId };
};
