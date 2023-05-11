import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { findItems, findItemsQueryKey } from 'api/item/findItems';
import { ItemByUUIDResponse } from 'models/item/item';
import useStore from 'modules/Store';
import { throwError } from 'utils/error';

interface Categories {
  [key: string]: ItemByUUIDResponse[];
}

export default function useExploreFilters() {
  const userCurrentType = useStore((state) => state.userCurrentType);
  const userUuid = useStore((state) => state.userUUID);

  const [originalProperties, setOriginalProperties] = useState<
    ItemByUUIDResponse[]
  >([]);
  const [applyingFilters, setApplyingFilters] = useState<boolean>(false);
  const [categories, setCategories] = useState<Categories>({});
  const [originalCategories, setOriginalCategories] = useState<Categories>({});
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [territoriesFilter, setTerritoriesFilter] = useState<{
    selections: ChangeEvent<HTMLInputElement>[];
  }>({
    selections: [],
  });
  const [categoriesFilter, setCategoriesFilter] = useState<{
    selections: ChangeEvent<HTMLInputElement>[];
  }>({
    selections: [],
  });
  const [channelsOfDistributionFilter, setChannelsOfDistributionFilter] =
    useState<{
      selections: ChangeEvent<HTMLInputElement>[];
    }>({
      selections: [],
    });
  const [minimumGuaranteeAmountMin, setMinimumGuaranteeAmountMin] = useState<
    string | number
  >();
  const [minimumGuaranteeAmountMax, setMinimumGuaranteeAmountMax] = useState<
    string | number
  >();
  const [minimumGuaranteePercentMin, setMinimumGuaranteePercentMin] = useState<
    string | number
  >();
  const [minimumGuaranteePercentMax, setMinimumGuaranteePercentMax] = useState<
    string | number
  >();
  const [range, setRangeValue] = useState({ min: 0, max: 100 });

  const clearAllFilters = () => {
    setApplyingFilters(true);
    setMinimumGuaranteeAmountMin('');
    setMinimumGuaranteeAmountMax('');
    setMinimumGuaranteePercentMin('');
    setMinimumGuaranteePercentMax('');
    setChannelsOfDistributionFilter({ selections: [] });
    setCategoriesFilter({ selections: [] });
    setTerritoriesFilter({ selections: [] });
    useStore.setState({ navbarSearchText: '' });
    setIsFiltered(false);
  };

  const toggleCategoriesFilter = (item: ChangeEvent<HTMLInputElement>) => {
    let sel = categoriesFilter.selections;
    if (sel.some((e) => e?.target?.value === item?.target?.value)) {
      sel = sel.filter(
        (e: ChangeEvent<HTMLInputElement>) =>
          e?.target?.value !== item?.target?.value
      );
    } else {
      sel.push(item);
    }
    setCategoriesFilter({
      selections: sel,
    });
  };

  const toggleEvent = (item: ChangeEvent<HTMLInputElement>) => {
    let sel = territoriesFilter.selections;
    if (sel.some((e) => e?.target?.value === item?.target?.value)) {
      sel = sel.filter(
        (e: ChangeEvent<HTMLInputElement>) =>
          e?.target?.value !== item?.target?.value
      );
    } else {
      sel.push(item);
    }
    setTerritoriesFilter({
      selections: sel,
    });
  };

  const toggleChannels = (item: ChangeEvent<HTMLInputElement>) => {
    let sel = channelsOfDistributionFilter.selections;
    if (sel.some((e) => e?.target?.value === item?.target?.value)) {
      sel = sel.filter(
        (e: ChangeEvent<HTMLInputElement>) =>
          e?.target?.value !== item?.target?.value
      );
    } else {
      sel.push(item);
    }
    setChannelsOfDistributionFilter({
      selections: sel,
    });
  };

  const handleChangeField = (event: any, name: string) => {
    // 👇 Get input value from "event"
    if (name === 'min') {
      setRangeValue({
        min: parseInt(event.target.value, 10) || 0,
        max: range.max,
      });
      setMinimumGuaranteePercentMin(event.target.value);
    } else {
      setRangeValue({
        min: range.min,
        max: parseInt(event.target.value, 10) || 0,
      });
      setMinimumGuaranteePercentMax(event.target.value);
    }
  };

  const handleChangeFieldDollar = (event: any, name: string) => {
    // 👇 Get input value from "event"
    if (name === 'min') {
      setMinimumGuaranteeAmountMin(event.target.value);
    } else {
      setMinimumGuaranteeAmountMax(event.target.value);
    }
  };

  const handleChangeRange = (value: { max: number; min: number }) => {
    setRangeValue(value);
    setMinimumGuaranteePercentMax(value.max);
    setMinimumGuaranteePercentMin(value.min);
  };

  const applyFilters = () => {
    setApplyingFilters(true);
    const filterMethods = [
      (item: ItemByUUIDResponse) => {
        if (territoriesFilter.selections.length === 0) return true;
        return territoriesFilter.selections.some((r) =>
          item.territories.includes(r.target.value)
        );
      },
      (item: ItemByUUIDResponse) => {
        if (channelsOfDistributionFilter.selections.length === 0) return true;
        return channelsOfDistributionFilter.selections.some((r) =>
          item.distribution_channels.includes(r.target.value)
        );
      },
      (item: ItemByUUIDResponse) => {
        if (categoriesFilter.selections.length === 0) {
          item.categoriesNamesFilter = undefined;
          return true;
        }
        const categoriesNamesFilter = categoriesFilter.selections.map((cat) => {
          return cat.target.value;
        });

        item.categoriesNamesFilter = categoriesNamesFilter;

        const itemCategoryNameValue = item.categories.map((value) => {
          return value.category_name;
        });

        return categoriesFilter.selections.some((r) =>
          itemCategoryNameValue.includes(r.target.value)
        );
      },
      (item: ItemByUUIDResponse) => {
        if (!minimumGuaranteeAmountMin && !minimumGuaranteeAmountMax)
          return true;

        const minAmount = !!minimumGuaranteeAmountMin
          ? minimumGuaranteeAmountMin
          : 0;
        const maxAmount = !!minimumGuaranteeAmountMax
          ? minimumGuaranteeAmountMax
          : 1e18;

        return !item.minimum_guarantee_amount
          ? false
          : // @ts-ignore
            _.inRange(item.minimum_guarantee_amount, minAmount, maxAmount);
      },
      (item: ItemByUUIDResponse) => {
        if (
          minimumGuaranteePercentMin !== 0 &&
          minimumGuaranteePercentMax !== 100
        )
          return true;
        const minAmount = !!minimumGuaranteePercentMin
          ? minimumGuaranteePercentMin
          : 0;
        const maxAmount = !!minimumGuaranteePercentMax
          ? minimumGuaranteePercentMax
          : 1e18;

        return !item.minimum_guarantee_percent
          ? false
          : // @ts-ignore
            _.inRange(item.minimum_guarantee_percent, minAmount, maxAmount);
      },
    ];

    const newProperties = [...originalProperties];

    const filteredArray = newProperties?.reduce<ItemByUUIDResponse[]>(
      (accumulator, currentItem) => {
        if (filterMethods.every((filterMethod) => filterMethod(currentItem))) {
          return [...accumulator, currentItem];
        }
        return accumulator;
      },
      []
    );

    // handlePageClick(1);
    territoriesFilter.selections.length !== 0 ||
    channelsOfDistributionFilter.selections.length !== 0 ||
    categoriesFilter.selections.length !== 0 ||
    !!minimumGuaranteePercentMax ||
    !!minimumGuaranteePercentMin ||
    !!minimumGuaranteeAmountMax ||
    !!minimumGuaranteeAmountMin
      ? setIsFiltered(true)
      : setIsFiltered(false);

    organizeProductsByCategory(filteredArray);
    setApplyingFilters(false);
  };

  const organizeProductsByCategory = useCallback(
    (products: ItemByUUIDResponse[]) => {
      const newCategories: Categories = {};

      products.forEach((product) => {
        product.categories.forEach((category) => {
          const categoryName = category.category_name;
          if (product.categoriesNamesFilter) {
            if (product.categoriesNamesFilter.includes(categoryName)) {
              if (!newCategories[categoryName]) {
                newCategories[categoryName] = [];
              }
              newCategories[categoryName].push(product);
            }
          } else {
            if (!newCategories[categoryName]) {
              newCategories[categoryName] = [];
            }
            newCategories[categoryName].push(product);
          }
        });
      });

      setCategories(newCategories);
    },
    [categories, originalCategories]
  );

  const {
    data: properties,
    isLoading,
    isRefetching,
  } = useQuery({
    queryKey: [findItemsQueryKey, userCurrentType],
    queryFn: async () => {
      const items = await findItems({ params: {} });
      if (userCurrentType === 'collaboration') {
        const collabs = items.filter(
          (item: ItemByUUIDResponse) =>
            item.permitted_deal_types.includes('Collaboration') &&
            !!item.image_logo
        );
        return collabs;
      } else {
        const licensing = items.filter(
          (item: any) =>
            item.permitted_deal_types.includes('Licensing') && !!item.image_logo
        );
        return licensing;
      }
    },
    enabled: !!userUuid,
    onError: (err) => {
      throwError(err);
    },
  });

  useEffect(() => {
    territoriesFilter.selections.length !== 0 ||
    channelsOfDistributionFilter.selections.length !== 0 ||
    categoriesFilter.selections.length !== 0 ||
    !!minimumGuaranteePercentMax ||
    !!minimumGuaranteePercentMin ||
    !!minimumGuaranteeAmountMax ||
    !!minimumGuaranteeAmountMin
      ? setIsFiltered(true)
      : setIsFiltered(false);

    if (applyingFilters) {
      applyFilters();
      setApplyingFilters(false);
    }
  }, [
    categoriesFilter,
    territoriesFilter,
    channelsOfDistributionFilter,
    minimumGuaranteePercentMax,
    minimumGuaranteePercentMin,
    minimumGuaranteeAmountMax,
    minimumGuaranteeAmountMin,
  ]);

  useEffect(() => {
    if (!Object.entries(originalCategories).length) {
      setOriginalCategories(categories);
    }
  }, [categories]);

  useEffect(() => {
    if (!properties) return;
    setOriginalProperties(properties);
    organizeProductsByCategory(properties);
  }, [properties]);

  return {
    range,
    properties,
    categories,
    originalCategories,
    isLoading,
    isFiltered,
    minimumGuaranteeAmountMax,
    minimumGuaranteeAmountMin,
    clearAllFilters,
    categoriesFilter,
    toggleCategoriesFilter,
    territoriesFilter,
    toggleEvent,
    channelsOfDistributionFilter,
    toggleChannels,
    handleChangeField,
    handleChangeRange,
    applyFilters,
    handleChangeFieldDollar,
  };
}
