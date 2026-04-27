"use client";
import { updateCardOrder } from "@/actions/update-card-order";
import { updateListOrder } from "@/actions/update-list-order";
import { useAction } from "@/hooks/use-action";
import { ListWithCards } from "@/types";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ListForm from "./list-form";
import ListItem from "./list-item";
interface ListContainerProps {
  boardId: string;
  data: ListWithCards[];
}

export default function ListContainer({ boardId, data }: ListContainerProps) {
  const [orderedData, setOrderedData] = useState(data);
  useEffect(() => {
    setOrderedData(data);
  }, [data]);
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List ordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card ordered");
    },
    onError: (error) => toast.error(error),
  });
  function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [moved] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, moved);
    return result;
  }
  function onDragEnd(result: DropResult) {
    const { source, destination, type } = result;
    if (!destination) {
      return;
    }
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index }),
      );
      setOrderedData(items);
      // TODO: Trigger Server Action
      executeUpdateListOrder({ items, boardId });
    }
    if (type === "card") {
      const newOrderedData = [...orderedData];
      const sourceList = newOrderedData.find(
        (item) => item.id === source.droppableId,
      );
      const destinationList = newOrderedData.find(
        (item) => item.id === destination.droppableId,
      );
      if (!sourceList || !destinationList) {
        return;
      }
      if (!sourceList.cards) {
        sourceList.cards = [];
      }
      if (!destinationList.cards) {
        destinationList.cards = [];
      }
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index,
        );
        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });
        sourceList.cards = reorderedCards;
        setOrderedData(newOrderedData);
        // TODO: Trigger Server Action
        executeUpdateCardOrder({
          items: reorderedCards,
          boardId,
        });
      } else {
        // Removed card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // Add card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard);

        // update the order for each card in the source list
        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        // update the order for each card in the destination list
        destinationList.cards.forEach((card, idx) => {
          card.order = idx;
        });
        setOrderedData(newOrderedData);
        // TODO: Trigger Server Action
        executeUpdateCardOrder({
          boardId,
          items: destinationList.cards,
        });
      }
    }
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => {
          return (
            <ol
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex gap-x-3 h-full"
            >
              {orderedData.map((list, index) => {
                return <ListItem key={list.id} index={index} data={list} />;
              })}
              {provided.placeholder}
              <ListForm />
              <div className="shrink-0 w-1"></div>
            </ol>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
}
