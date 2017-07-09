/**
 * Update base url with query parameters
 * eg: getUrlWithQueryParams(www.somewhere.com, { brand: 'uq', somethingElse: 'value' })
 * gives the string => 'www.somewhere.com?brand=uq&somethingElse=value'
 * @param   {String} base
 * @param   {Object} [queryData={}]
 * @return  {String} base url with queries
 */
export function getUrlWithQueryParams(base, queryData = {}) {
  const queries = Object.keys(queryData);

  return queries.reduce((acc, query, index) => {
    const url = `${acc}${encodeURIComponent(query)}=${encodeURIComponent(queryData[query])}`;

    return index + 1 < queries.length ? `${url}&` : url;
  }, `${base}?`);
}
