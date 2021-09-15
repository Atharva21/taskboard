const initialData = {
	tasks: {
		task1: { id: "task1", content: "take out garbage 🚮" },
		task2: { id: "task2", content: "drink milk 🥛" },
		task3: { id: "task3", content: "feed the cat 😸" },
		task4: { id: "task4", content: "take a walk 🚶‍♀️" },
	},
	columns: {
		column1: {
			id: "column1",
			title: "To Do",
			taskIds: ["task1", "task2", "task3", "task4"],
		},
		column2: {
			id: "column2",
			title: "In Progress",
			taskIds: [],
		},
		column3: {
			id: "column3",
			title: "Done",
			taskIds: [],
		},
	},
	columnOrder: ["column1", "column2", "column3"],
	boardId: "board-1",
};

export default initialData;
