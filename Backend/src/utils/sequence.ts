// utils/sequence.ts
import mongoose, { Schema } from 'mongoose';

interface ICounter {
  _id: string;
  seq: number;
}

const counterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter =
  (mongoose.models.Counter as mongoose.Model<ICounter>) ||
  mongoose.model<ICounter>('Counter', counterSchema);

/**
 * Hands out the next human readable id for a model (BK000001, AB000001, ...).
 *
 * Counting the documents in the collection is not safe: deleting a record makes
 * the count fall behind and every later insert then collides with an id that is
 * already taken (E11000), and two concurrent requests read the same count. An
 * atomic $inc on a counter document avoids both.
 */
export const nextSequentialId = async (
  model: mongoose.Model<any>,
  field: string,
  prefix: string,
  pad = 6
): Promise<string> => {
  const counterName = `${model.modelName}.${field}`;

  // First time this counter is used, start it from the highest id already in the
  // collection so we don't re-issue ids created by the old count-based scheme.
  const existing = await Counter.findById(counterName).lean();
  if (!existing) {
    const last = await model
      .findOne({ [field]: { $regex: `^${prefix}\d+$` } })
      .sort({ [field]: -1 })
      .select(field)
      .lean();
    const start = last ? Number(String((last as any)[field]).slice(prefix.length)) || 0 : 0;
    await Counter.updateOne(
      { _id: counterName },
      { $setOnInsert: { seq: start } },
      { upsert: true }
    );
  }

  // Walk forward past any id that is somehow still taken (e.g. records inserted
  // by hand) instead of failing the request.
  for (let attempt = 0; attempt < 50; attempt++) {
    const counter = await Counter.findByIdAndUpdate(
      counterName,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const id = `${prefix}${String(counter!.seq).padStart(pad, '0')}`;
    if (!(await model.exists({ [field]: id }))) {
      return id;
    }
  }

  throw new Error(`Could not generate a unique ${field} for ${model.modelName}`);
};

export default Counter;
