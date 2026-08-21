import { useEffect, useState, type FC } from 'react';
import type { GeneralTableProps } from './types';
import { useRouter } from 'next/router';
import UserCardColumnTable from 'components/Table/UserCardColumnTable';
import StatusLabel from 'components/Table/StatusLabel';
import StatusGateway from 'components/Table/StatusGateway';
import { currency, number } from 'utility/number';
import TableSkeleton from './Skeleton';
import { indonesianDateTime } from 'utility/date';
import { Box, Flex, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import TableWrapper from 'components/Table/TableWrapper';
import Pagination from './Pagination';
import { get } from 'lodash';
import PlusMinusNumber from './PlusMinusNumber';
import Link from 'next/link';
import type { Symbol } from './PlusMinusNumber/types';
import UserProfile from 'components/UserProfile';
import { colors } from 'styles/theme/constants';
import EmptyState from 'components/EmptyState';
import AngleDown from 'components/Icon/AngleDown';
import Text from 'components/Typography/Text';

const GeneralTable: FC<GeneralTableProps> = ({
  data = [],
  loading,
  columns = [],
  page,
  pageName,
  pageDataName,
  pageEvent,
  customSkeleton,
  rowOnClickUrl,
  rowOnClickDynamicRoute,
  skeletonTotalRow = 10,
  rowHeight,
  emptyMessage = 'Data Tidak Ditemukan',
  emptyMessageFilter = 'Data Tidak Ditemukan',
  emptyMessageDescription = "Klik 'Tambah' untuk membuat data baru",
  emptyMessageDescriptionFilter = 'Pastikan keyword sudah benar atau gunakan keyword lain',
  wrapper,
  coloredRow,
  isBordered = false,
  isFilter = false,
  setOrder,
  totals
}) => {
  const router = useRouter();

  const renderContent = (d: any, column: any) => {
    let objectValue: any = '';

    if (typeof column?.key === 'object' && column?.key !== null) {
      objectValue = { ...column.key };
      Object.keys(objectValue).forEach((key) => {
        objectValue[key] = get(d, objectValue[key], '');
      });
    } else if (
      Array.isArray(column?.key) &&
      (column?.type === 'user' || column?.type === 'plusMinusNumber')
    ) {
      objectValue = column?.key.map((c: any) => {
        // replace string key to object notation
        return get(d, c, '');
      });
    } else if (column?.type === 'hardcodeText' && column?.text) {
      objectValue = column?.text;
    } else {
      // replace string key to object notation
      objectValue = get(d, column?.key, '');
    }

    // column type
    switch (column.type) {
      case 'user':
        return (
          <UserCardColumnTable
            avatar={objectValue[0]}
            name={objectValue[1]}
            username={objectValue[2] || '-'}
          />
        );
      case 'userProfile':
        return (
          <UserProfile
            name={objectValue.name}
            email={objectValue.email}
            phone={objectValue.phone}
            status={objectValue.status}
            avatar={objectValue.avatar}
            id={objectValue.id}
          />
        );
      case 'label':
        return <StatusLabel status={objectValue} type={column?.labelType || ''} />;
      case 'paymentLabel':
        return <StatusGateway status={objectValue} />;
      case 'number':
        return number(objectValue as unknown as number);
      case 'currency':
        return currency(objectValue as unknown as number);
      case 'plusMinusNumber':
        return (
          <PlusMinusNumber
            symbol={objectValue[0] as Symbol}
            amount={objectValue[1] as unknown as number}
          />
        );
      case 'date':
        return indonesianDateTime(objectValue as unknown as number);
      case 'dangerouslySetInnerHTML':
        return <Box dangerouslySetInnerHTML={{ __html: objectValue }} />;
      case 'onClickUrl':
        let pathname = column.onClickUrl;

        if (Array.isArray(column?.onClickDynamicRoute)) {
          column?.onClickDynamicRoute.forEach((dt: any) => {
            pathname = pathname + '/' + get(d, dt, '');
          });
        } else {
          pathname =
            pathname +
            (column?.onClickDynamicRoute ? '/' + get(d, column?.onClickDynamicRoute, '') : '');
        }

        return (
          <Link href={pathname}>
            <a>
              <span className="cursor-pointer">{column?.html}</span>
            </a>
          </Link>
        );
      case 'custom':
        return column.cell(d);
      default:
        return objectValue || '-';
    }
  };

  return (
    <>
      <TableWrapper>
        {wrapper}
        <div className="overflow-x-auto">
          <table className={'table'}>
            <thead
              style={{
                backgroundColor: colors.callaLily,
                color: colors.bastille,
                padding: '24px'
              }}
            >
              <tr>
                {columns.map((column: any, index: number) => {
                  return (
                    <th
                      key={index}
                      style={{
                        width: column.width || 'auto',
                        minWidth: column.width || 'auto',
                        fontSize: '12px',
                        fontWeight: '700',
                        lineHeight: '18px',
                        verticalAlign: 'top',
                        ...(column.textAlign && {
                          textAlign: column.textAlign
                        })
                      }}
                    >
                      {column.isSorted ? (
                        <Menu autoSelect={false} isLazy={true} strategy="fixed">
                          <MenuButton
                            fontWeight={700}
                            _focus={{
                              outline: 'none'
                            }}
                          >
                            <Flex alignItems={'flex-start'} cursor={'pointer'}>
                              {column.title || ''}
                              <AngleDown fill={colors.silverCharm} />
                            </Flex>
                          </MenuButton>
                          <MenuList
                            overflow="hidden"
                            borderRadius="8px"
                            padding={0}
                            border="none"
                            boxShadow={'0px 8px 16px rgba(20, 23, 26, 0.16)'}
                            pos={'fixed'}
                            left="-50px"
                            top="10px"
                          >
                            <Text
                              variant="bodySmallBold"
                              padding={'12px 16px'}
                              _focus={{ outline: 'none' }}
                              color={colors.tarnishedSilver}
                              border={'0px 0px 1px 0px'}
                            >
                              Sort
                            </Text>
                            <MenuItem
                              fontWeight={'700'}
                              fontSize={'14px'}
                              lineHeight={'17px'}
                              padding={'12px 16px'}
                              _focus={{ outline: 'none' }}
                              _hover={{ color: 'ottomanRed', bg: 'maryRose' }}
                              color={'darkWillow'}
                              onClick={(e) => {
                                setOrder &&
                                  setOrder({
                                    type: 'asc',
                                    by: column.key
                                  });
                              }}
                            >
                              Ascending
                            </MenuItem>
                            <MenuItem
                              fontWeight={'700'}
                              fontSize={'14px'}
                              lineHeight={'17px'}
                              padding={'12px 16px'}
                              _focus={{ outline: 'none' }}
                              _hover={{ color: 'ottomanRed', bg: 'maryRose' }}
                              color={'darkWillow'}
                              onClick={(e) => {
                                setOrder &&
                                  setOrder({
                                    type: 'desc',
                                    by: column.key
                                  });
                              }}
                            >
                              Descending
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      ) : (
                        column.title || ''
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                customSkeleton ? (
                  customSkeleton
                ) : (
                  <TableSkeleton totalColumn={columns.length} totalRow={skeletonTotalRow} />
                )
              ) : data?.length > 0 ? (
                <>
                  {data?.map((d: any, i: number) => {
                    return (
                      <Box
                        as="tr"
                        border={isBordered ? 'solid 1px' : 'unset'}
                        borderColor={isBordered ? 'callaLily' : 'unset'}
                        bgColor={
                          coloredRow && d[coloredRow.field] === coloredRow.value
                            ? coloredRow.color
                            : 'unset'
                        }
                        height={rowHeight ?? 'auto'}
                        cursor={rowOnClickUrl ? 'pointer' : 'unset'}
                        key={i}
                        onClick={() => {
                          rowOnClickUrl
                            ? router.push(
                                rowOnClickUrl +
                                  (rowOnClickDynamicRoute
                                    ? '/' + get(d, rowOnClickDynamicRoute, '')
                                    : '')
                              )
                            : undefined;
                        }}
                      >
                        {columns.map((column: any, index: number) => {
                          return (
                            <td
                              key={index}
                              className="align-top"
                              style={{
                                color: colors.bastille,
                                ...(column.textAlign && {
                                  textAlign: column.textAlign
                                })
                              }}
                            >
                              {renderContent(d, column)}
                            </td>
                          );
                        })}
                      </Box>
                    );
                  })}
                  {totals && totals.length !== 0 && (
                    <Box
                      as="tr"
                      border={isBordered ? 'solid 1px' : 'unset'}
                      borderColor={isBordered ? 'callaLily' : 'unset'}
                      bgColor={'unset'}
                      height={rowHeight ?? 'auto'}
                      cursor={rowOnClickUrl ? 'pointer' : 'unset'}
                    >
                      {totals.map((total: any, index: number) => {
                        return (
                          <td
                            key={index}
                            className="align-center"
                            style={{
                              color: colors.bastille,
                              fontWeight: 700,
                              paddingTop: '1rem',
                              ...(total.textAlign && {
                                textAlign: total.textAlign
                              })
                            }}
                          >
                            {total.name}
                          </td>
                        );
                      })}
                    </Box>
                  )}
                </>
              ) : (
                <tr className="text-center">
                  <td colSpan={columns.length} className="py-8 text-sm font-medium">
                    <EmptyState
                      imageSrc="/assets/images/empty-state-illustration.png"
                      title={isFilter ? emptyMessageFilter : emptyMessage}
                      description={
                        isFilter ? emptyMessageDescriptionFilter : emptyMessageDescription
                      }
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {page && (
          <div className="mx-6 pt-2 pb-4 border-calla_lily">
            <Pagination
              hidden={!data || data.length === 0 || loading}
              page={page}
              rowCount={data?.length || 0}
              event={pageEvent}
              pageName={pageName || 'table-name'}
              dataName={pageDataName}
            />
          </div>
        )}
      </TableWrapper>
    </>
  );
};

export default GeneralTable;
