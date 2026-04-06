// Базовые типы значений Firestore
export type FirestoreStringValue = { stringValue: string };
export type FirestoreIntegerValue = { integerValue: string };
export type FirestoreArrayValue = {
  arrayValue: {
    values?: FirestoreValue[];
  };
};
export type FirestoreMapValue = {
  mapValue: { fields: Record<string, FirestoreValue> };
};

export type FirestoreValue =
  | FirestoreStringValue
  | FirestoreIntegerValue
  | FirestoreArrayValue
  | FirestoreMapValue
  | { booleanValue: boolean }
  | { nullValue: null }
  | { geoPointValue: { latitude: number; longitude: number } }
  | { timestampValue: string };
