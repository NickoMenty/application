'use client';

import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/button';
import {
  Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure,
} from '@nextui-org/modal';
import { deleteItem } from '@/app/(other)/profile/items/actions';

export default function DeleteButton({ id }: { id: ItemId }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const onDelete = () => {
    deleteItem(id);
  };

  return (
    <>
      <Button
        color="danger"
        variant="light"
        isIconOnly
        size="sm"
        aria-label="Delete"
        onClick={onOpen}
      >
        <TrashIcon className="size-4" />
      </Button>
      <Modal
        isOpen={isOpen}
        placement="auto"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody><p>Are you sure you want to delete the item?</p></ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Close</Button>
                <Button color="primary" onPress={onDelete}>Action</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
