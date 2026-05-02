import React,{ useState, useEffect, useRef, memo } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
export default function RankingOrder ({ value, onChange }){
  const [items, setItems] = useState(value.length ? value : ["", "", ""]);
  const maxItems = 10;

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setItems(reordered);
    onChange(reordered);
  };

  const handleChange = (index, newValue) => {
    const updated = [...items];
    updated[index] = newValue;
    setItems(updated);
    onChange(updated);
  };

  const addItem = () => {
    if (items.length < maxItems) {
      const updated = [...items, ""];
      setItems(updated);
      onChange(updated);
    }
  };

  const deleteItem = (index) => {
    if (items.length > 3) {
      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
      onChange(updated);
    }
  };

  const removeAll = () => {
    if (items.length > 3) {
      const updated = items.slice(0, 3);
      setItems(updated);
      onChange(updated);
    }
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="ranking-list">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ width: "300px", margin: "0 auto" }}
            >
              {items.map((item, index) => (
                <Draggable key={index} draggableId={String(index)} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "8px",
                        marginBottom: "6px",
                        background: snapshot.isDragging ? "#e0f7fa" : "#fafafa",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <span style={{ marginRight: "8px" }}>{index + 1}.</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleChange(index, e.target.value)}
                        style={{ flex: 1 }}
                      />
                      {items.length > 3 && (
                        <button
                          className="btn-delete-ranking"
                          onClick={() => deleteItem(index)}
                          style={{ marginLeft: "8px" }}
                          type='button'
                        >
                          delete
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

      <hr />
      <div>
        <button onClick={addItem} disabled={items.length >= maxItems} type='button'>
          Add more choice
        </button>
        {items.length > 3 && (
          <button onClick={removeAll} type='button'>Remove all</button>
        )}
      </div>
    </div>
  );
};