const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: [100, 'Task title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must belong to a user']
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    required: false,
    validate: {
      validator: function(value) { 
        return !value || value >= new Date();
      },
      message: 'Due date cannot be in the past'
    }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    trim: true,
    maxlength: [50, 'Category cannot be more than 50 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
 
TaskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
 
TaskSchema.index({ user: 1 });
TaskSchema.index({ completed: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ priority: 1 });

module.exports = mongoose.model('Task', TaskSchema);