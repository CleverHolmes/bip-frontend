import { useChat } from '@chatscope/use-chat';
import { useQuery } from '@tanstack/react-query';
import * as _ from 'lodash';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { retrieveDeals, retrieveDealsQueryKey } from 'api/deal/retrieveDeals';
import { Modal, ModalContents, ModalOpenButton } from 'components/ModalWindow';
import DealModal from 'components/Modals/Deal';
import Button from 'components/new/Button/Button';
import VerifiedMark from 'components/new/VerifiedMark';
import Pagination from 'components/new/Pagination/Pagination';
import ChipGroup from 'components/new/ChipGroup';
import CompanyLogo from 'components/new/CompanyLogo';
import TextHeader from 'components/new/TextHeader';
import Icon from 'components/new/Icon';
import useTokensOrCookies from 'contexts/TokensOrCookies';
import useAuth from 'hooks/useAuth';
import { usePagination } from 'hooks/usePagination';
import type { DealResponse } from 'models/deals/deals';
import useStore from 'modules/Store';
import { throwError } from 'utils/error';
import { getCurrentUuid } from 'utils/getCurrentUuid';
import SearchBar from './components/SearchBar/SearchBar';
import StatusLabel from './components/StatusLabel/StatusLabel';
import SortButton from './components/SortButton/SortButton';

const NewDealStatusView = () => {
  const userUUID = useStore((state) => state.userUUID);
  const router: NextRouter = useRouter();
  const { query } = router;
  const { handleChangePage, page, itemsPerPage } = usePagination();
  const [totalPages, setTotalPages] = useState(0);
  const handlePageClick = (newPage: number) => {
    handleChangePage(newPage);
    window.scrollTo(0, 0);
  };

  const { companyRepresented } = useTokensOrCookies();

  const [openSearch, setOpenSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refresh, setRefresh] = useState<boolean>(true);
  const [dealStatusFilter, setDealStatusFilter] = useState<string>('All');
  const [dealTypeFilter, setDealTypeFilter] = useState<string>('All');
  const [outgoingIncomingFilter, setOutgoingIncomingFilter] =
    useState<string>('All');
  const [dealsFiltered, setDealsFiltered] = useState<DealResponse[]>([]);
  const [dealsPaginated, setDealsPaginated] = useState<DealResponse[]>([]);
  const [dealsLoaded, setDealsLoaded] = useState<boolean>(false);
  const [sorting, setSorting] = useState({
    key: 'deal_name',
    ascending: false,
  });
  function applySorting(key: string, ascending: boolean) {
    setSorting({ key, ascending });
  }

  const { conversations } = useChat();
  const { isLogged } = useAuth();
  const { t } = useTranslation();
  const senderUuid = getCurrentUuid();

  const [specificDeal, setSpecificDeal] = useState(false);

  useEffect(() => {
    if (!query.dealId) return;
    if (query.dealId) {
      setSpecificDeal(true);
    }
  }, [query.dealId]);

  const refreshDeal = () => {
    setRefresh(true);
  };

  useEffect(() => {
    if (senderUuid) {
      setRefresh(true);
    }
  }, [senderUuid]);

  const { data: deals } = useQuery({
    queryKey: [retrieveDealsQueryKey],
    queryFn: async () => {
      const body = {
        user_uuid: senderUuid,
      };
      // @ts-ignore
      const res2 = await retrieveDeals(body);
      const sortedDeals = res2.sort((a, b) =>
        a.revision < b.revision ? 1 : -1
      );
      const dealsWithNewest = _.uniqBy(sortedDeals, 'uuid');
      setDealsLoaded(true);
      setRefresh(false);
      setTotalPages(Math.ceil(dealsWithNewest?.length / itemsPerPage));
      return dealsWithNewest;
    },
    enabled: !!isLogged && refresh && !!senderUuid,
    onError: (err) => {
      throwError(err);
    },
  });

  const typeOfDeal = (deal: DealResponse) => {
    return (
      conversations?.filter(
        (item) =>
          item.data.deal_uuid === deal.uuid &&
          deal.status.toLowerCase() === 'proposed'
      ).length >= 1
    );
  };

  useEffect(() => {
    const filteringByProgress = (dealFilter: DealResponse) => {
      if (
        dealStatusFilter.toLowerCase() !== 'proposed' &&
        dealStatusFilter.toLowerCase() !== 'in progress'
      ) {
        return (
          dealFilter.status.toLowerCase() === dealStatusFilter.toLowerCase()
        );
      } else if (dealStatusFilter.toLowerCase() === 'in progress') {
        return (
          dealFilter.status.toLowerCase() === 'proposed' &&
          conversations?.filter(
            (item) => item.data.deal_uuid === dealFilter.uuid
          ).length >= 1
        );
      } else {
        return (
          dealFilter.status.toLowerCase() === 'proposed' &&
          conversations?.filter(
            (item) => item.data.deal_uuid === dealFilter.uuid
          ).length === 0
        );
      }
    };

    if (deals && !specificDeal) {
      return dealStatusFilter === 'All' &&
        outgoingIncomingFilter === 'All' &&
        dealTypeFilter === 'All'
        ? setDealsFiltered(deals)
        : dealStatusFilter === 'All' && dealTypeFilter === 'All'
        ? outgoingIncomingFilter === 'Incoming'
          ? setDealsFiltered(
              deals.filter(
                (deal) =>
                  deal.counterparty_user_uuid === userUUID ||
                  deal.counterparty_user_uuid === companyRepresented
              )
            )
          : setDealsFiltered(
              deals.filter(
                (deal) =>
                  deal.user_uuid === userUUID ||
                  deal.user_uuid === companyRepresented
              )
            )
        : dealStatusFilter === 'All' && outgoingIncomingFilter === 'All'
        ? setDealsFiltered(
            deals.filter(
              (deal) =>
                deal.deal_type.toLowerCase() === dealTypeFilter.toLowerCase()
            )
          )
        : dealTypeFilter === 'All' && outgoingIncomingFilter === 'All'
        ? setDealsFiltered(
            deals.filter((deal) => {
              return filteringByProgress(deal);
            })
          )
        : dealStatusFilter === 'All'
        ? outgoingIncomingFilter === 'Incoming'
          ? setDealsFiltered(
              deals.filter(
                (deal) =>
                  (deal.counterparty_user_uuid === userUUID ||
                    deal.counterparty_user_uuid === companyRepresented) &&
                  deal.deal_type.toLowerCase() === dealTypeFilter.toLowerCase()
              )
            )
          : setDealsFiltered(
              deals.filter(
                (deal) =>
                  (deal.user_uuid === userUUID ||
                    deal.user_uuid === companyRepresented) &&
                  deal.deal_type.toLowerCase() === dealTypeFilter.toLowerCase()
              )
            )
        : dealTypeFilter === 'All'
        ? outgoingIncomingFilter === 'Incoming'
          ? setDealsFiltered(
              deals.filter((deal) => {
                return (
                  (deal.counterparty_user_uuid === userUUID ||
                    deal.counterparty_user_uuid === companyRepresented) &&
                  filteringByProgress(deal)
                );
              })
            )
          : setDealsFiltered(
              deals.filter((deal) => {
                return (
                  (deal.user_uuid === userUUID ||
                    deal.user_uuid === companyRepresented) &&
                  filteringByProgress(deal)
                );
              })
            )
        : outgoingIncomingFilter === 'All'
        ? setDealsFiltered(
            deals.filter((deal) => {
              return (
                deal.deal_type.toLowerCase() === dealTypeFilter.toLowerCase() &&
                filteringByProgress(deal)
              );
            })
          )
        : outgoingIncomingFilter === 'Incoming'
        ? setDealsFiltered(
            deals.filter((deal) => {
              return (
                (deal.counterparty_user_uuid === userUUID ||
                  deal.counterparty_user_uuid === companyRepresented) &&
                filteringByProgress(deal) &&
                deal.deal_type.toLowerCase() === dealTypeFilter.toLowerCase()
              );
            })
          )
        : setDealsFiltered(
            deals.filter((deal) => {
              return (
                (deal.user_uuid === userUUID ||
                  deal.user_uuid === companyRepresented) &&
                filteringByProgress(deal) &&
                deal.deal_type.toLowerCase() === dealTypeFilter.toLowerCase()
              );
            })
          );
    } else if (deals && specificDeal) {
      if (!query.dealId) return;
      setDealsFiltered(deals.filter((deal) => deal.uuid === query.dealId));
    }
  }, [
    deals,
    dealStatusFilter,
    outgoingIncomingFilter,
    userUUID,
    companyRepresented,
    dealTypeFilter,
    conversations,
    query.dealId,
    specificDeal,
  ]);

  useEffect(() => {
    if (!dealsFiltered) return;
    const filteredDeals =
      searchQuery && searchQuery !== ''
        ? [...dealsFiltered].filter((item) =>
            item.deal_name?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [...dealsFiltered];
    const paginatedList = filteredDeals.splice(
      (page - 1) * itemsPerPage,
      itemsPerPage
    );
    const sortedDeals = paginatedList.sort((a: object, b: object) => {
      return _.get(a, sorting.key)?.localeCompare(_.get(b, sorting.key));
    });
    setDealsPaginated(sorting.ascending ? sortedDeals : sortedDeals.reverse());
  }, [dealsFiltered, page, itemsPerPage, sorting, searchQuery]);

  // const GoToChat = (deal: DealResponse) => {
  //   const conversationId = deal.message_conversation_uuid;
  //   if (conversationId) {
  //     void router.push(
  //       routes.chatConversation,
  //       `${routes.chat}/${conversationId}`
  //     );
  //   } else {
  //     void router.push(routes.chat);
  //   }
  //
  //   return new Promise((resolve, reject) => {
  //     resolve(201);
  //   });
  // };

  return (
    <div className="px-24 max-w-[80rem] mx-auto">
      <div className="flex flex-col justify-between md:flex-row lg:mb-4 md:items-center">
        <div
          className={`mt-32 mb-6 text-3xl sm:justify-normal sm:items-center leading-8 flex ${
            openSearch ? 'flex-col' : ''
          } sm:flex-row`}
        >
          <TextHeader
            text={t('deal-status.deal-status')}
            className="font-bold"
          />
          <SearchBar
            openSearch={openSearch}
            setOpenSearch={setOpenSearch}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {!specificDeal && (
        <div className="flex justify-between overflow-x-auto mb-32 no-scrollbar">
          <ChipGroup
            onClick={setDealStatusFilter}
            selectedLabel={dealStatusFilter}
            labels={[
              {
                label: t('deal-status.all-deals'),
                value: t('deal-status.all'),
                count: 101,
              },
              { label: t('deal-status.accepted'), count: 6 },
              { label: t('deal-status.in-progress'), count: 6 },
              { label: t('deal-status.proposed'), count: 6 },
              { label: t('deal-status.rejected'), count: 2 },
              { label: t('deal-status.draft'), count: 4 },
            ]}
          />
          <div className="flex ml-5 md:ml-56">
            <ChipGroup
              onClick={setOutgoingIncomingFilter}
              selectedLabel={outgoingIncomingFilter}
              className="mr-4"
              labels={[
                {
                  label: t('deal-status.all'),
                },
                { label: t('deal-status.incoming') },
                { label: t('deal-status.outgoing') },
              ]}
            />
            <ChipGroup
              onClick={setDealTypeFilter}
              selectedLabel={dealTypeFilter}
              className="ml-5 md:ml-56 sm:mr-2"
              labels={[
                {
                  label: t('deal-status.all'),
                },
                { label: t('deal-status.licensing') },
                { label: t('deal-status.collaboration') },
              ]}
            />
          </div>
        </div>
      )}

      <div className="pb-4 mt-4 -mx-4 sm:-mx-8">
        <div>
          {dealsPaginated && (
            <div>
              <div className="min-w-full leading-normal bg-white block overflow-auto">
                <div className="flex gap-48 lg:gap-14 justify-between font-bodyText font-bold sticky top-0 bg-white text-inputGray font-custom2 border-b-1 border-grayN50">
                  <div className="lg:flex-1 flex-none max-w-md w-[10rem] lg:w-auto pl-3 pb-5 text-base">
                    <div className="flex flex-row">
                      <SortButton
                        label={t('deal-status.deal-name')}
                        onClick={() =>
                          applySorting('deal_name', !sorting.ascending)
                        }
                        isActive={sorting.key === 'deal_name'}
                      />
                    </div>
                  </div>
                  <div className="w-90 lg:w-110 flex-none pb-5 text-base leading-tight text-left">
                    <div className="flex flex-row">
                      <SortButton
                        label={t('deal-status.sender')}
                        onClick={() =>
                          applySorting('user.company_name', !sorting.ascending)
                        }
                        isActive={sorting.key === 'user.company_name'}
                      />
                    </div>
                  </div>
                  <div className="w-88 lg:w-110 flex-none pb-5 text-base leading-tight text-left">
                    <div className="flex flex-row">
                      <SortButton
                        label={t('deal-status.receiver')}
                        onClick={() =>
                          applySorting(
                            'counterparty.company_name',
                            !sorting.ascending
                          )
                        }
                        isActive={sorting.key === 'counterparty.company_name'}
                      />
                    </div>
                  </div>
                  <div className="w-[6rem] flex-none pb-5 text-base leading-tight text-left">
                    <div className="flex flex-row">
                      <SortButton
                        label={t('deal-status.status')}
                        onClick={() =>
                          applySorting('status', !sorting.ascending)
                        }
                        isActive={sorting.key === 'status'}
                      />
                    </div>
                  </div>
                  {/* <div className="px-5 pb-5 text-sm text-center"></div> */}
                  <div className="w-[8rem] flex-none md:flex hidden pb-5 text-base leading-tight text-left">
                    {t('deal-status.action')}
                  </div>
                </div>
                <div>
                  {dealsLoaded ? (
                    dealsPaginated.map((deal: DealResponse, index: number) => {
                      return (
                        <Modal key={index}>
                          <div
                            key={deal.uuid}
                            className="flex gap-48 justify-between bg-white cursor-pointer font-bodyText border-b-1 border-grayN50"
                          >
                            <div className="lg:flex-1 flex-none max-w-md w-[10rem] lg:w-auto pl-3 underline py-5 my-auto text-sm text-base text-primary hover:text-button whitespace-nowrap overflow-hidden text-ellipsis">
                              {deal.deal_name}
                            </div>
                            <div className="py-5 text-sm w-90 lg:w-110 flex-none">
                              <div className="flex items-center gap-2">
                                <Link href={`/company/${deal.user.uuid}`}>
                                  <a
                                    title={deal.user.company_name}
                                    className="flex items-center gap-4 overflow-hidden"
                                  >
                                    <CompanyLogo
                                      src={deal.user.company_logo.uri}
                                      altTitle="Licensee Image"
                                      companyName={deal.user.company_name}
                                    />
                                    <p className="ml-4 text-base text-primary hover:text-button overflow-hidden whitespace-nowrap text-ellipsis">
                                      {deal.user.company_name}
                                    </p>
                                  </a>
                                </Link>
                                <VerifiedMark show={deal.user.verified_user} />
                              </div>
                            </div>

                            <div className="w-88 lg:w-110 flex-none py-5 text-sm">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/company/${deal.counterparty.uuid}`}
                                >
                                  <a
                                    title={deal.counterparty.company_name}
                                    className="flex items-center gap-4 overflow-hidden"
                                  >
                                    <CompanyLogo
                                      src={deal.counterparty.company_logo.uri}
                                      altTitle="Licensee Image"
                                      companyName={deal.user.company_name}
                                    />
                                    <p className="ml-4 text-base text-primary hover:text-button capitalize whitespace-nowrap overflow-hidden text-ellipsis">
                                      {deal.counterparty.company_name?.toLowerCase()}
                                    </p>
                                  </a>
                                </Link>
                                <VerifiedMark
                                  show={deal.counterparty.verified_user}
                                />
                              </div>
                            </div>

                            <div className="w-[6rem] flex-none py-5 text-sm">
                              <div className="flex justify-start items-center">
                                <StatusLabel
                                  status={
                                    typeOfDeal(deal)
                                      ? 'In Progress'
                                      : deal.status
                                  }
                                />
                                <div className="flex md:hidden ml-20 h-fit">
                                  <Icon name={'ChevronRight'} size="sm" />
                                </div>
                              </div>
                            </div>

                            {/* <div className="px-5 py-5 text-sm  border-b-1 border-grayN50">
                              {conversations?.filter(
                                (item) => item.data.deal_uuid === deal.uuid
                              ).length >= 1 && (
                                <div
                                  className="px-2 py-1 bg-white border-[1px] border-button text-button rounded-full flex items-center justify-center hover:border-inputGray hover:bg-button hover:text-white cursor-pointer min-w-[142px]"
                                  onClick={() => GoToChat(deal)}
                                >
                                  {t('deal-status.go-to-deal-room')}
                                </div>
                              )}
                            </div> */}

                            <div className="w-[8rem] flex-none md:flex hidden py-5 text-sm">
                              <ModalOpenButton>
                                <Button
                                  variant="secondary"
                                  iconAfter="RightArrow"
                                  className="whitespace-nowrap"
                                >
                                  {t('deal-status.view-deal')}
                                </Button>
                              </ModalOpenButton>
                            </div>
                          </div>
                          <ModalContents modalNoPadding>
                            <DealModal
                              deal={deal}
                              dealStatus={deal.status}
                              userUUID={userUUID}
                              refreshDeal={refreshDeal}
                            />
                          </ModalContents>
                        </Modal>
                      );
                    })
                  ) : (
                    <>
                      {[...Array(6)].map((_, i) => {
                        return (
                          <div key={i} className="px-5 py-5">
                            {[...Array(6)].map((_, i) => {
                              return (
                                <div
                                  className="px-5 py-5 text-sm border-b-1 border-grayN50"
                                  key={i}
                                />
                              );
                            })}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
              <div>
                {deals && deals.length === 0 && (
                  <div className="mt-20 text-lg font-normal text-center text-inputGray font-custom1">
                    {t('deal-status.you-currently-have-no-deals-head-to-the')}{' '}
                    <Link href="/explore">
                      <span className="mx-1 underline cursor-pointer hover:text-button">
                        {t('deal-status.explore-page')}
                      </span>
                    </Link>
                    {t('deal-status.to-find-someone-to-make-a-deal-with')}
                  </div>
                )}
              </div>
              <Pagination
                className={`flex items-center justify-center my-32 ${
                  !totalPages || totalPages <= 1 ? 'invisible' : ''
                }`}
                totalPages={totalPages}
                selectedPage={page}
                handlePageClick={handlePageClick}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewDealStatusView;
