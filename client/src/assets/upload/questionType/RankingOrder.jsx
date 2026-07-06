import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "../../style/upload/questionType/rankingorder.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faTrashCan,
  faUpDown,
  faArrowDown,
  faArrowUp,
  faPlus
} from "@fortawesome/free-solid-svg-icons";

export default function RankingOrder({ value, onChange }) {
  // Fully controlled: no internal copy of the list. Reading straight from
  // `value` (with a safe fallback) means this always reflects the parent's
  // current state, including after a reset — previously this component kept
  // its own `items` state via useState, which only initializes once on mount
  // and never resyncs when `value` changes, causing stale data to leak into
  // later edits.
  const items = value.length ? value : ["", "", ""];

  const maxItems = 10;

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(items);

    const [moved] = reordered.splice(result.source.index, 1);

    reordered.splice(result.destination.index, 0, moved);

    onChange(reordered);
  };

  const handleChange = (index, newValue) => {
    const updated = [...items];

    updated[index] = newValue;

    onChange(updated);
  };

  const addItem = () => {
    if (items.length < maxItems) {
      onChange([...items, ""]);
    }
  };

  const deleteItem = (index) => {
    if (items.length > 3) {
      onChange(items.filter((_, i) => i !== index));
    }
  };

  const removeAll = () => {
    if (items.length > 3) {
      onChange(items.slice(0, 3));
    }
  };

  return (
     <div className="question-type-wrapper">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="ranking-list">
          {(provided) => (
            <div
              className="ranking-parent"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {items.map((item, index) => (
                <Draggable
                  key={index}
                  draggableId={String(index)}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      className={`ranking-row ${
                        snapshot.isDragging ? "ranking-dragging" : ""
                      }`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={provided.draggableProps.style}
                    >
                      <div
                        className="ranking-drag"
                        {...provided.dragHandleProps}
                      >
                       {index === 0 ? (
                          <FontAwesomeIcon icon={faArrowDown} />
                        ) : index === items.length - 1 ? (
                          <FontAwesomeIcon icon={faArrowUp} />
                        ) : (
                          <FontAwesomeIcon icon={faUpDown} />
                        )}
                        
                      </div>

                      <div className="ranking-number">
                        {index + 1}. 
                      </div>

                      <input
                        type="text"
                        className="ranking-input"
                        placeholder={`Rank ${index + 1}`}
                        value={item}
                        onChange={(e) =>
                          handleChange(index, e.target.value)
                        }
                      />

                      {items.length > 3 && (
                        <button
                          className="btn-delete-ranking"
                          onClick={() => deleteItem(index)}
                          type="button"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>


      <div className="ranking-actions">
        <button
          onClick={addItem}
          disabled={items.length >= maxItems}
          type="button"
          className="btn-ranking"
        >
          <FontAwesomeIcon icon={faPlus} />
          Add more 
        </button>

        {items.length > 3 && (
          <button
            onClick={removeAll}
            type="button"
            className="btn-ranking btn-remove-ranking"
          >
            Remove all
          </button>
        )}
      </div>
    </div>
  );
}
// import React, { useState } from "react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// import "../../style/upload/questionType/rankingorder.css";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import {
//   faTrashCan,
//   faGripVertical,
//   faUpDown,
//   faTurnDown,
//   faArrowDown,
//   faArrowUp
// } from "@fortawesome/free-solid-svg-icons";

// import { faPlus } from "@fortawesome/free-solid-svg-icons";

// export default function RankingOrder({ value, onChange }) {
//   const [items, setItems] = useState(
//     value.length ? value : ["", "", ""]
//   );

//   const maxItems = 10;

//   const handleDragEnd = (result) => {
//     if (!result.destination) return;

//     const reordered = Array.from(items);

//     const [moved] = reordered.splice(result.source.index, 1);

//     reordered.splice(result.destination.index, 0, moved);

//     setItems(reordered);
//     onChange(reordered);
//   };

//   const handleChange = (index, newValue) => {
//     const updated = [...items];

//     updated[index] = newValue;

//     setItems(updated);
//     onChange(updated);
//   };

//   const addItem = () => {
//     if (items.length < maxItems) {
//       const updated = [...items, ""];

//       setItems(updated);
//       onChange(updated);
//     }
//   };

//   const deleteItem = (index) => {
//     if (items.length > 3) {
//       const updated = items.filter((_, i) => i !== index);

//       setItems(updated);
//       onChange(updated);
//     }
//   };

//   const removeAll = () => {
//     if (items.length > 3) {
//       const updated = items.slice(0, 3);

//       setItems(updated);
//       onChange(updated);
//     }
//   };

//   return (
//      <div className="question-type-wrapper">
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <Droppable droppableId="ranking-list">
//           {(provided) => (
//             <div
//               className="ranking-parent"
//               {...provided.droppableProps}
//               ref={provided.innerRef}
//             >
//               {items.map((item, index) => (
//                 <Draggable
//                   key={index}
//                   draggableId={String(index)}
//                   index={index}
//                 >
//                   {(provided, snapshot) => (
//                     <div
//                       className={`ranking-row ${
//                         snapshot.isDragging ? "ranking-dragging" : ""
//                       }`}
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       style={provided.draggableProps.style}
//                     >
//                       <div
//                         className="ranking-drag"
//                         {...provided.dragHandleProps}
//                       >
//                        {index === 0 ? (
//                           <FontAwesomeIcon icon={faArrowDown} />
//                         ) : index === items.length - 1 ? (
//                           <FontAwesomeIcon icon={faArrowUp} />
//                         ) : (
//                           <FontAwesomeIcon icon={faUpDown} />
//                         )}
                        
//                       </div>

//                       <div className="ranking-number">
//                         {index + 1}. 
//                       </div>

//                       <input
//                         type="text"
//                         className="ranking-input"
//                         placeholder={`Rank ${index + 1}`}
//                         value={item}
//                         onChange={(e) =>
//                           handleChange(index, e.target.value)
//                         }
//                       />

//                       {items.length > 3 && (
//                         <button
//                           className="btn-delete-ranking"
//                           onClick={() => deleteItem(index)}
//                           type="button"
//                         >
//                           <FontAwesomeIcon icon={faTrashCan} />
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </Draggable>
//               ))}

//               {provided.placeholder}
//             </div>
//           )}
//         </Droppable>
//       </DragDropContext>


//       <div className="ranking-actions">
//         <button
//           onClick={addItem}
//           disabled={items.length >= maxItems}
//           type="button"
//           className="btn-ranking"
//         >
//           <FontAwesomeIcon icon={faPlus} />
//           Add more 
//         </button>

//         {items.length > 3 && (
//           <button
//             onClick={removeAll}
//             type="button"
//             className="btn-ranking btn-remove-ranking"
//           >
//             Remove all
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }