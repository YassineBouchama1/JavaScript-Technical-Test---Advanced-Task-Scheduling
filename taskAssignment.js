// what i have to do
//convert dummy data devs & tasks
// validate data  : return error
//create obje of developers with empty task lists 
//create function help to chck if all dependencies are complated
//create fun to calcu if dev can take this task or not
//sort tasks by priority and depens

// if dev can hanlde task assign it to him
// return data


const developers = [
    { name: 'Yassine', skillLevel: 7, maxHours: 40, preferredTaskType: 'feature' },
    { name: 'Admin', skillLevel: 9, maxHours: 30, preferredTaskType: 'bug' }
];

const tasks = [
    { taskName: 'Feature A', difficulty: 7, hoursRequired: 15, taskType: 'feature', priority: 4, dependencies: [] },
    { taskName: 'Bug Fix B', difficulty: 5, hoursRequired: 10, taskType: 'bug', priority: 5, dependencies: [] },
    { taskName: 'Refactor C', difficulty: 9, hoursRequired: 25, taskType: 'refactor', priority: 3, dependencies: ['Bug Fix B'] },
    { taskName: 'Optimization D', difficulty: 6, hoursRequired: 20, taskType: 'feature', priority: 2, dependencies: [] },
    { taskName: 'Upgrade E', difficulty: 8, hoursRequired: 15, taskType: 'feature', priority: 5, dependencies: ['Feature A'] }

];


// validator fun for dev 
function isValidDeveloper(dev) {
    return dev && typeof dev.name === 'string' && typeof dev.skillLevel === 'number' &&
        typeof dev.maxHours === 'number' && typeof dev.preferredTaskType === 'string';
}


// validator fun for task 
function isValidTask(task) {
    return task && typeof task.taskName === 'string' && typeof task.difficulty === 'number' &&
        typeof task.hoursRequired === 'number' && typeof task.taskType === 'string' &&
        typeof task.priority === 'number' && Array.isArray(task.dependencies);
}



// func to check if all depens are completed
function areDependenciesCompleted(task, developers) {
    return task.dependencies.every(dep =>
        developers.some(dev => dev.assignedTasks.some(t => t.taskName === dep))
    );
}



//fun to calcu if dev can take this task or not based on difficult and task type
function canDeveloperTakeTask(dev, task) {
    return dev.skillLevel >= task.difficulty && dev.preferredTaskType === task.taskType;
}




// this main function 
function assignTasksWithPriorityAndDependencies(developers, tasks) {


    // validation
    if (!Array.isArray(developers) || !developers.every(isValidDeveloper)) {
        return { error: "Invalid developers data" };
    }
    if (!Array.isArray(tasks) || !tasks.every(isValidTask)) {
        return { error: "Invalid tasks data" };
    }



    //1- create copy of developers with empty task lists
    let developersFormated = developers.map(dev => ({
        ...dev,
        assignedTasks: [],
        totalHours: 0
    }));



    //2- here Sort tasks by priority
    let sortedTasks = [...tasks].sort((a, b) => b.priority - a.priority);



    // here will conatin unAssignedTasks
    let unassignedTasks = [];


    //3- loop throught all tasks 
    for (let task of sortedTasks) {
        let assigned = false;

        // 3.1 - check if all depends complted 
        if (!areDependenciesCompleted(task, developersFormated)) {
            unassignedTasks.push(task);
            continue; // if yes skip 
        }

        // 3.2 - here loop throught devs to find best on for task
        for (let dev of developersFormated) {

            //3.3 check if dv has hours enugh for complte task and it's under his ab
            if (dev.totalHours + task.hoursRequired <= dev.maxHours && canDeveloperTakeTask(dev, task)) {

                // if dev can do this task assign it to him
                dev.assignedTasks.push(task);
                dev.totalHours += task.hoursRequired;
                assigned = true;
                break;
            }
        }

        // 3.4 here is no task assign to any dev  push them to unassignedTasks
        if (!assigned) {
            unassignedTasks.push(task);
        }
    }


    return {
        developers: developersFormated, // return formated dev
        unassignedTasks: unassignedTasks //  tasks that not assigned
    };
}


function runTasksTest() {
    console.log("starth Task Assignment Test...\n");

    const result = assignTasksWithPriorityAndDependencies(developers, tasks);


    // display error if exist
    if (result.error) {
        console.error(result.error);
        return;
    }


    // display results for each developer
    result.developers.forEach(dev => {
        console.log(`\nDev: ${dev.name}`);
        console.log(`Total Wrk Hours: ${dev.totalHours}`);
        console.log("Assigned Tasks:");
        dev.assignedTasks.forEach(task => {
            console.log(`- ${task.taskName} (${task.hoursRequired} hours)`);
        });
    });

    // display unassigned tasks
    if (result.unassignedTasks.length > 0) {
        console.log("\nUnassigned Tasks:");
        result.unassignedTasks.forEach(task => {
            console.log(`- ${task.taskName}`);
        });
    }
}


runTasksTest();