// function TaskCard({ title, description, status, onDelete, onEdit }) {
//   const getStatusStyle = () => {
//     if (status === "Completed") {
//       return "bg-green-100 text-green-700";
//     }

//     if (status === "In Progress") {
//       return "bg-blue-100 text-blue-700";
//     }

//     return "bg-yellow-100 text-yellow-700";
//   };

//   return (
//     <div className="px-6 py-5 hover:bg-gray-50 transition">
//       <div className="flex items-start justify-between gap-4">
//         {/* Task information */}
//         <div>
//           <h3 className="font-semibold text-gray-800">{title}</h3>

//           <p className="text-sm text-gray-500 mt-1">{description}</p>
//         </div>

//         {/* Status */}
//         <span
//           className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusStyle()}`}
//         >
//           {status}
//         </span>
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end gap-3 mt-4">
//         <button
//           type="button"
//           onClick={onEdit}
//           className="text-sm text-blue-600 font-medium hover:underline"
//         >
//           Edit
//         </button>

//         <button
//           type="button"
//           onClick={onDelete}
//           className="text-sm text-red-600 font-medium hover:underline"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }

// export default TaskCard;

function TaskCard({ title, description, status, due_date, onDelete, onEdit }) {
  // =========================
  // STATUS STYLE
  // =========================

  const getStatusStyle = () => {
    if (status === "Completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "In Progress") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) {
      return null;
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =========================
  // DUE DATE STATUS
  // =========================

  const getDueDateInfo = () => {
    if (!due_date) {
      return null;
    }

    // Completed tasks don't need an overdue warning
    if (status === "Completed") {
      return {
        text: `Due: ${formatDate(due_date)}`,
        style: "text-gray-500",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(`${due_date}T00:00:00`);
    dueDate.setHours(0, 0, 0, 0);

    const difference = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    // Overdue
    if (difference < 0) {
      return {
        text: `Overdue: ${formatDate(due_date)}`,
        style: "text-red-600 font-medium",
      };
    }

    // Due today
    if (difference === 0) {
      return {
        text: "Due today",
        style: "text-orange-600 font-medium",
      };
    }

    // Due within 3 days
    if (difference <= 3) {
      return {
        text: `Due soon: ${formatDate(due_date)}`,
        style: "text-orange-600 font-medium",
      };
    }

    // Normal future date
    return {
      text: `Due: ${formatDate(due_date)}`,
      style: "text-gray-500",
    };
  };

  const dueDateInfo = getDueDateInfo();

  return (
    <div className="px-6 py-5 hover:bg-gray-50 transition">
      {/* ========================= */}
      {/* TASK INFORMATION */}
      {/* ========================= */}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-800 break-words">{title}</h3>

          {description && (
            <p className="text-sm text-gray-500 mt-1 break-words">
              {description}
            </p>
          )}

          {/* Due Date */}

          {dueDateInfo && (
            <div className={`text-sm mt-3 ${dueDateInfo.style}`}>
              📅 {dueDateInfo.text}
            </div>
          )}
        </div>

        {/* ========================= */}
        {/* STATUS */}
        {/* ========================= */}

        <span
          className={`px-3 py-1 rounded-full
                     text-sm font-medium
                     whitespace-nowrap
                     self-start
                     ${getStatusStyle()}`}
        >
          {status}
        </span>
      </div>

      {/* ========================= */}
      {/* ACTIONS */}
      {/* ========================= */}

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onEdit}
          className="text-sm text-blue-600
                     font-medium hover:underline"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="text-sm text-red-600
                     font-medium hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
