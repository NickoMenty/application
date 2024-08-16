'use client';

import React, { useRef, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Input, useDisclosure } from '@nextui-org/react';
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
} from '@nextui-org/modal';
import { decrypt } from './actions';

export default function ContractButton(
  { contract }: { contract: { id: string, data: string, url: string } },
) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const passwordRef = useRef<HTMLInputElement>(null);
  const [decrypted, setDecrypted] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);

  const onDecrypt = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = JSON.parse(await decrypt(contract, passwordRef.current?.value || ''));

      setName(data.name);
      setDescription(data.description);
      setDecrypted(true);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <>
      <Button onPress={onOpen} variant="light">{contract.id}</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{decrypted ? name : 'Set password'}</ModalHeader>
              <ModalBody>
                {!decrypted ? (
                  <Input
                    ref={passwordRef}
                    autoFocus
                    label="Password"
                    placeholder="Enter password"
                    type="password"
                    size="sm"
                    isInvalid={Boolean(error)}
                    errorMessage={error}
                  />
                ) : (
                  <p>{description}</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {!decrypted && (
                <Button color="primary" onPress={onDecrypt} isLoading={isLoading}>
                  Decrypt
                </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
