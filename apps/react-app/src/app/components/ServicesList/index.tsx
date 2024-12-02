import React from 'react';
import { WBBox, WBList, WBNoResults } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { ServicesListItem } from './ServicesListItem';
import { Service } from '@admiin-com/ds-graphql';
import { useInfiniteScroll } from '@admiin-com/ds-hooks';

interface ServicesListProps {
  items?: Service[];
  loading?: boolean;
  selected: Service | null;
  query: string;
  hasNextPage?: boolean;
  handleLoadMore?: () => void;
  setSelected?: (contact: Service | null) => void;
  onAddClick?: () => void;
}

export function ServicesList({
  items,
  loading = false,
  selected,
  setSelected,
  query,
  handleLoadMore,
  hasNextPage,
  onAddClick,
}: ServicesListProps) {
  const { t } = useTranslation();

  const lastElementRef = useInfiniteScroll({
    fetchMore: handleLoadMore,
    loading,
    hasNextPage: hasNextPage ?? false,
  });
  const listRef = React.useRef<HTMLDivElement>(null); // Ref for the list container
  return (
    <WBBox
      sx={{
        //backgroundColor: '#FFFFFF',
        boxShadow: '0 1px 22px 0 rgba(0, 0, 0, 0.08)',
        zIndex: 1, // Adjust z-index
        position: 'relative',
        flexGrow: 1,
        overflow: 'overlay',
      }}
      ref={listRef}
    >
      <WBList disablePadding>
        {items?.map((item, index) => (
          <ServicesListItem
            key={item.id}
            ref={index === items.length - 1 ? lastElementRef : null}
            selected={selected?.id === item.id}
            item={item}
            onClick={setSelected}
          />
        ))}
      </WBList>
      {!loading && items?.length === 0 ? (
        <WBBox>
          <WBNoResults
            title={
              query
                ? t('noResultsTitle', { ns: 'services' })
                : t('addAService', { ns: 'services' })
            }
            description={
              query
                ? t('noResultsFound', { ns: 'services' })
                : t('addAServiceDescription', { ns: 'services' })
            }
            btnTitle={t('addService', { ns: 'services' })}
            onClick={!query ? onAddClick : undefined}
          />
        </WBBox>
      ) : null}
      {(loading || !items) && (
        <WBList>
          {Array.from({ length: 5 }).map((_, index) => (
            <ServicesListItem key={index} item={null} />
          ))}
        </WBList>
      )}
    </WBBox>
  );
}
