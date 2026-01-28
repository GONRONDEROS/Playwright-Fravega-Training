// utils/APIProducts.js
const { request } = require('@playwright/test');

class APIProducts {
    constructor(baseUrl = 'https://www.fravega.com/api/v1') {
        this.baseUrl = baseUrl;
    }

    async listProducts() {
        // Crear un nuevo contexto de request
        const context = await request.newContext();

        // Hacer la llamada POST con el payload
        const response = await context.post(this.baseUrl, {
            headers: { 'Content-Type': 'application/json' },
            data   : 
            {
                operationName: "listProducts_Shopping",
                query        : "query listProducts_Shopping($size: PositiveInt!, $isSingleCategory: Boolean!, $offset: Int, $sorting: [SortOption!], $customSorted: Boolean = false, $filtering: ItemFilteringInputType, $isGeoLocated: Boolean = false) {\n  items(filtering: $filtering) {\n    total\n    recommendations {\n      keywords: products\n      __typename\n    }\n    results(\n      size: $size\n      buckets: [{sorting: $sorting, customSorted: $customSorted, offset: $offset}]\n    ) {\n      ...extendedItemFragment\n      __typename\n    }\n    aggregations {\n      availableStock @include(if: $isGeoLocated) {\n        ...availabilityStockAggregation\n        __typename\n      }\n      sellerCondition(size: $size) {\n        cardinality\n        values {\n          count\n          filtered\n          condition\n          __typename\n        }\n        __typename\n      }\n      collections(aggregable: true) {\n        values {\n          ...collectionAggregationFragment\n          __typename\n        }\n        __typename\n      }\n      installments {\n        values {\n          ...collectionAggregationFragment\n          __typename\n        }\n        __typename\n      }\n      categories(market: \"fravega\", flattened: $isSingleCategory) {\n        ...categoryAggregationFragment\n        children {\n          ...categoryAggregationFragment\n          __typename\n        }\n        __typename\n      }\n      attributes {\n        ...attributeAggregationFragment\n        __typename\n      }\n      salePrice {\n        ...rangedSalePriceAggregationFragment\n        __typename\n      }\n      brands {\n        cardinality\n        values(size: 6, sorting: FREQUENCY) {\n          ...brandAggregationFragment\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    listUniqueId\n    __typename\n  }\n}\n\nfragment extendedItemFragment on ExtendedItem {\n  sellers {\n    commercialName\n    __typename\n  }\n  stockLabels\n  id\n  title\n  katalogCategoryId\n  brand {\n    id\n    name\n    __typename\n  }\n  skus {\n    results {\n      code\n      categorization(market: \"fravega\") {\n        name\n        slug\n        __typename\n      }\n      resolvedBidId\n      sponsored\n      campaignId\n      pricing(channel: \"fravega-ecommerce\") {\n        channel\n        listPrice\n        salePrice\n        discount\n        __typename\n      }\n      netPricing: pricing(channel: \"net-price\") {\n        channel\n        listPrice\n        salePrice\n        discount\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  gtin {\n    __typename\n    ... on EAN {\n      number\n      __typename\n    }\n  }\n  id\n  images\n  collections(onlyThoseWithCockade: true) {\n    cardinality\n    values {\n      id\n      name\n      slug\n      count\n      cockade(tag: \"listing\") {\n        position\n        image\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  installments {\n    cardinality\n    values {\n      id\n      name\n      slug\n      count\n      cockade(tag: \"listing\") {\n        position\n        image\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  listPrice {\n    amounts {\n      min\n      max\n      __typename\n    }\n    __typename\n  }\n  salePrice {\n    amounts {\n      min\n      max\n      __typename\n    }\n    discounts {\n      min\n      max\n      __typename\n    }\n    __typename\n  }\n  slug\n  __typename\n}\n\nfragment availabilityStockAggregation on AvailabilityStockAggregation {\n  deliveryTerms {\n    value\n    count\n    __typename\n  }\n  types {\n    value\n    count\n    __typename\n  }\n  costs {\n    value\n    count\n    __typename\n  }\n  __typename\n}\n\nfragment collectionAggregationFragment on CollectionAggregation {\n  id\n  name\n  count\n  slug\n  filtered\n  __typename\n}\n\nfragment categoryAggregationFragment on CategoryAggregation {\n  name\n  slug\n  count\n  path {\n    id\n    name\n    slug\n    __typename\n  }\n  children {\n    name\n    slug\n    count\n    path {\n      id\n      name\n      slug\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment attributeAggregationFragment on AttributeAggregation {\n  name\n  slug\n  tags\n  measureUnit {\n    name\n    symbol\n    __typename\n  }\n  values(size: 20) {\n    type\n    value\n    slug\n    count\n    seo\n    filtered\n    __typename\n  }\n  ranges {\n    from\n    to\n    count\n    value\n    slug\n    seo\n    filtered {\n      from\n      to\n      value\n      slug\n      seo\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment rangedSalePriceAggregationFragment on RangedSalePriceAggregation {\n  amounts {\n    ranges(size: 3) {\n      from\n      to\n      count\n      value\n      slug\n      __typename\n    }\n    min\n    max\n    __typename\n  }\n  discounts {\n    ranges(interval: 10) {\n      from\n      count\n      value\n      slug\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nfragment brandAggregationFragment on BrandAggregation {\n  name\n  count\n  slug\n  image\n  filtered\n  __typename\n}\n",
                variables: { customSorted: false, isGeoLocated: true, isSingleCategory: true, offset: 0, size: 15, sorting: ["TOTAL_SALES_IN_LAST_30_DAYS"], filtering: { categories: ["celulares/celulares-liberados"], active: true, availableStock: { postalCodes: "C1406", includeThoseWithNoAvailableStockButListable: true }, salesChannels: ["fravega-ecommerce"] } } 
            }
        });

        if (!response.ok()) {
            throw new Error(`API call failed: ${response.status()}`);
        }

        const body = await response.json();

        // Devolver array con nombre y precio
        return body.data.items.results.map(item => {
        const sku = item.skus?.results?.[0]; // primer SKU
        const ecommercePricing = sku?.pricing?.find(p => p.channel === "fravega-ecommerce");
        return {
            id: item.id,
            title: item.title?.trim(),
            listPrice: ecommercePricing?.listPrice ?? null,
            salePrice: ecommercePricing?.salePrice ?? null,
            discount: ecommercePricing?.discount ?? null
            };
        });
    }
}

module.exports = { APIProducts };

