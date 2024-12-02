import { useFormContext } from 'react-hook-form';
import { useTaskCreationContext } from '../../pages/TaskCreation/TaskCreation';
import React from 'react';
import { PageType } from './type';
import { TaskStatus } from '@admiin-com/ds-graphql';

export const useTaskCreateModal = () => {
  {
    const context = useTaskCreationContext();

    const { reset } = useFormContext();

    const modalContentRef = React.useRef<HTMLDivElement>(null);
    const { handleClose, open = false, task } = context ?? {};
    const [page, setPage] = React.useState<PageType>('INVOICE&QUOTES');

    const handleScrollToTop = () => {
      if (modalContentRef.current) {
        console.log(modalContentRef.current.scrollTop);
        modalContentRef.current.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    };

    React.useEffect(() => {
      if (task && task.status === TaskStatus.DRAFT) {
        if (task.type === 'PAY_ONLY') setPage('INVOICE&QUOTES');
        if (task.type === 'SIGN_ONLY') setPage('E_SIGNATURE');
      }
    }, [task]);
    React.useEffect(() => {
      handleScrollToTop();
    }, [page]);

    return {
      open,
      onClose: handleClose,
      page: page,
      setPage,
    };
  }
};
