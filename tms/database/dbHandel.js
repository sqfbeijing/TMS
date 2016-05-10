var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var models = require("./models");

// 生成模型
for(var m in models){ 
	mongoose.model(m,new Schema(models[m]));
}

module.exports = { 
	getModel: function(type){ 
		return _getModel(type);
	}
};

var _getModel = function(type){ 
	return mongoose.model(type);
};