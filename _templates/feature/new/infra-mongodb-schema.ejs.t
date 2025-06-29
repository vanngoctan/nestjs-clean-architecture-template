---
to: src/infrastructure/database/mongodb/schemas/<%= kebabCase %>.schema.ts
---
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

/**
 * <%= pascalCase %> MongoDB Document
 */
export type <%= pascalCase %>Document = <%= pascalCase %>Schema & Document;

/**
 * <%= pascalCase %> MongoDB Schema
 * 
 * Mongoose schema for the <%= pascalCase %> entity in MongoDB.
 * This is part of the infrastructure layer and handles persistence.
 */
@Schema({
  collection: '<%= snakeCasePlural %>',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})
export class <%= pascalCase %>Schema {
  @Prop({ type: String, default: () => new MongooseSchema.Types.ObjectId().toString() })
  _id: string;
  
  // Define the timestamp properties
  @Prop()
  created_at: Date;
  
  @Prop()
  updated_at: Date;
  
  // Add your <%= pascalCase %> specific properties here
  // Example:
  // @Prop({ required: true })
  // name: string;
  
  // @Prop()
  // description?: string;
}

/**
 * Export the schema for use in the module
 */
export const <%= pascalCase %>MongooseSchema = SchemaFactory.createForClass(<%= pascalCase %>Schema);
