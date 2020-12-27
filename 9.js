const Mongoose = require('mongoose');
Mongoose.connect('mongodb://127.0.0.1:27017/task-manager', {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
});

const {User, Task} = modelCreation();
const user = populate();
populateSettings();

function modelCreation() {
    const taskSchema = Mongoose.Schema({
        description: {
            type: String,
            required: true
        },
        /*The 'owner' attribute is an example of physically 
            storing another model as an attribute. */
        owner: {
            type: Mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }, {
        timestamps: true
    });

    const userSchema = Mongoose.Schema({
        name: {
            type: String,
            required: true
        }
    });

    const Task = Mongoose.model('Task', taskSchema);

    /* Tasks are related to a single User model, so its alright
      to physically store the User model within the task. Alternatively,
      User models may contain many Task models. Consequently, its better to 
      create a virtual link that computes the Task models the User model
      is related to; physically storing the models would take up unecessary
      space. */
    userSchema.virtual('tasks', {
        ref: 'Task',
        localField: '_id',
        foreignField: 'owner'
    });

    const User = Mongoose.model('User', userSchema);


    return {User, Task};
}


async function populate() {
    let user = new User({
        name: 'Dinesh'
    });
    await user.save();
    
    let task = new Task({
        description: 'Take out the trash.',
        owner: user._id
    })
    await task.save();

    /*Populating the User instance will allow related Task instances
      to be accessed. Similarly, populating the Task instance will
      allow the User instance to be accessed. */

    console.log('Populating User in Task object:');
    console.log(task.owner);
    await task.populate('owner').execPopulate();
    console.log(task.owner);

    console.log('Populating Tasks in User object:');
    console.log(user.tasks);
    await user.populate('tasks').execPopulate();
    console.log(user.tasks);

    return user;
}

/*
    populate() has settings that allow for filtering, paginating,
    and sorting data. These settings are often specified by the 
    client through query parameters.

    - Pagination: Breaking data into a series of pages that contain
        a portion of the data each.
*/
async function populateSettings() {
    await user.populate({
        /*When altering the populate() settings, the target attribute has to be 
            specified through the 'path' attribute. */
        path: 'tasks',
        /*The 'match' attribute is used to find documents that contain the
        specified key-value pairs. */
        match: {
            completed: false
        },
        /*The 'options' attribute can be used to include the limit and skip 
        values, which will allow for pagination. Limit is the number of 
        entries to send, while skip is the number of entries to skip.
        Skipping entries will allow the client to access different pages. */
        options: {
            limit: 10,
            skip: 10,
            /*The sort attribute can be used to specify the order in which
            to send the data. -1 is descending, while 1 is ascending. */
            sort: {
                /*In this scenario, tasks are sorted with the recently created and
                incomplete tasks being listed first. */
                createdAt: -1,
                completed: 1
            }
        }

    }).execPopulate();
}