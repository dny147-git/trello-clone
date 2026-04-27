"use client";

import { cn } from "@/lib/utils";
import { ListWithCards } from "@/types";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "./card-form";
import CardItem from "./card-item";
import ListHeader from "./list-header";

interface ListItemProps {
  data: ListWithCards;
  index: number;
}
export default function ListItem({ index, data }: ListItemProps) {
  const textAreaRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);
  function disableEditing() {
    setIsEditing(false);
  }
  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef?.current?.focus();
    }, 0);
  }
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => {
        return (
          <li
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="shrink-0 h-full w-68 select-none"
          >
            <div
              {...provided.dragHandleProps}
              className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
            >
              <ListHeader data={data} onAddCard={enableEditing} />
              <Droppable droppableId={data.id} type="card">
                {(provided) => {
                  return (
                    <ol
                      className={cn(
                        "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                        data.cards.length > 0 ? "mt-2" : "mt-0",
                      )}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {data.cards.map((card, index) => {
                        return (
                          <CardItem index={index} key={card.id} data={card} />
                        );
                      })}
                      {provided.placeholder}
                    </ol>
                  );
                }}
              </Droppable>
              <CardForm
                listId={data.id}
                ref={textAreaRef}
                isEditing={isEditing}
                enableEditing={enableEditing}
                disableEditing={disableEditing}
              />
            </div>
          </li>
        );
      }}
    </Draggable>
  );
}
