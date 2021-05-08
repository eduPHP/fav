import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Toast from './Toast';
import { ToastMessage } from '../../hooks/toasts';

interface ContainerProps {
  toasts: ToastMessage[];
}

const Toasts: React.FC<ContainerProps> = ({ toasts }) => {
  return (
    <TransitionGroup className="fixed right-0 bottom-0 p-6 overflow-hidden grid gap-2">
      {toasts.map((toast, key) => (
        <CSSTransition
          key={toast.id}
          timeout={500}
          classNames={{
            enter: 'translate-x-[110%]',
            enterActive: 'translate-x-0',
            exit: 'translate-x-[110%]',
            exitActive: 'translate-x-[110%]',
          }}
          unmountOnExit
        >
          <Toast key={toast.id} toast={toast} />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

export default Toasts;
