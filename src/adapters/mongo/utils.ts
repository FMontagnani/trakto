import { Document, UUID } from "mongodb";

interface GenericSchema {
  id: string;
}

export function parseToSchema<T extends GenericSchema>(document: Document): T {
  const { _id, ...rest } = document;
  
  return {
    id: _id.toString(),
    ...rest,
  } as T;
}

export function parseToDocument<T extends GenericSchema>(schema: T): Document {
  const { id, ...rest } = schema;

  return {
    _id: new UUID(id as string),
    ...rest,
  } as Document;
}