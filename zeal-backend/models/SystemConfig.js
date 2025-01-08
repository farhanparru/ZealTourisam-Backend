const mongoose = require('mongoose');
const { Schema } = mongoose;

const systemConfigSchema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  module: { 
    type: String, 
    required: true 
  },
  json: { 
    type: Schema.Types.Mixed, 
    required: true 
  },
  active: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);

module.exports = SystemConfig;
