import { Document, model, models, Schema, Types } from "mongoose";

export interface IInteraction {
  user: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: "question" | "answer";
}

export const InteractionActionEnums = [
  "view",
  "upvote",
  "downvote",
  "bookmark",
  "post",
  "edit",
  "delete",
  "search",
] as const;

export interface IInteractionDoc extends IInteraction, Document {}

const interactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, enum: InteractionActionEnums, required: true },
  actionId: { type: Schema.Types.ObjectId, required: true },
  actionType: { type: String, enum: ["question", "answer"], required: true },
});

const Interaction =
  models?.Interaction || model<IInteraction>("Interaction", interactionSchema);

export default Interaction;
