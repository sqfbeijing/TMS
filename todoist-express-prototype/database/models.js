module.exports = {
	user: {
		name: {
			type: String,
			required: true
		},
		password: {
			type: String,
			required: true
		}
	},
	user_task: {
		username: String,
		types: [{
			type_name: String,
			tasks: [{
				name: String,
				complete: Boolean,
				content: String
			}]
		}]
	},
	task_state: {
		time: String,
		timeValue: Number,
		userName: String,
		action: String,
		taskName: String,
		praiseCount: Number,
		comments: [
		{
			time: String,
			timeValue: Number,
			speakUserName: String,
			content: String,
			reply: [
			{			
				time: String,
				timeValue: Number,
				speakUserName: String,
				content: String
			}
			]
		}
		]
	}
};

// {
//     "_id" : ObjectId("56d4000ec6d24bc492992d91"),
//     "types" : [ 
//         {
//             "type_name" : "21",
//             "_id" : ObjectId("56d91225b78199081554aff8"),
//             "tasks" : []
//         }, 
//         {
//             "_id" : ObjectId("56d9152f69b193591501610a"),
//             "tasks" : [ 
//                 {
//                     "complete" : false,
//                     "content" : " ",
//                     "name" : "111 2",
//                     "_id" : ObjectId("56d918d173e0f38f151d36fe")
//                 }
//             ],
//             "type_name" : "222"
//         }
//     ],
//     "username" : "s"
// }