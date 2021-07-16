const defaultResultList = {
  content_elements: [],
};

const reduceResultList = (state = defaultResultList, action) => {
  const { type, data } = action;

  if (!data) { return state; }

  const oldItemIds = state.content_elements.map((element) => element._id);
  const uniqueNewItems = data.content_elements
    .filter((element) => !oldItemIds.includes(element._id));

  switch (type) {
    case 'appendUnique': {
      return ({
        ...state,
        ...data,
        content_elements: [...state.content_elements, ...uniqueNewItems],
      });
    }
    default: { break; }
  }
  return state;
};

const resolveDefaultPromoElements = (customFields = {}) => {
  const fields = {
    showHeadline: true,
    showImage: true,
    showDescription: true,
    showByline: true,
    showDate: true,
  };
  const fieldKeys = Object.keys(fields);
  return fieldKeys.reduce((acc, key) => {
    if (typeof customFields[key] === 'undefined') {
      acc[key] = fields[key];
    } else {
      acc[key] = customFields[key];
    }
    return acc;
  }, fields);
};

export {
  reduceResultList,
  resolveDefaultPromoElements,
};
