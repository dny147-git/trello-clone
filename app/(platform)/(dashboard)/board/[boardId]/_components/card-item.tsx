import { Card } from "@/lib/generated/prisma/client";
import { Draggable } from "@hello-pangea/dnd";

interface CardItemProps {
  index: number;
  data: Card;
}

export default function CardItem({ index, data }: CardItemProps) {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => {
        return (
          <div
            role="button"
            className="truncate border-2 border-transparent hover:border-black
            py-2 px-3 text-sm bg-white rounded-md shadow-sm"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {data.title}
          </div>
        );
      }}
    </Draggable>
  );
}
