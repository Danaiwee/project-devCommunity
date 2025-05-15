import { Document, model, models, Schema, Types } from "mongoose";

export interface ITagQuestion {
  question: Types.ObjectId;
  tagId: Types.ObjectId;
}

export interface ITagQuestionDoc extends ITagQuestion, Document {}

const tagQuestionSchema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  tagId: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
});

const TagQuestion =
  models?.TagQuestion || model<ITagQuestion>("TagQuestion", tagQuestionSchema);

export default TagQuestion;
