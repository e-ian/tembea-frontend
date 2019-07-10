export const createDialogOptions = (data, width = '512px', _class = 'small-modal-panel-class') => {
  return {
    width, panelClass: _class,
    data
  };
};

export const filterDateParameters = (dateFilter) => {
  const startDate = dateFilter.startDate.from ? dateFilter.startDate.from : null;
  const endDate = dateFilter.endDate.to ? dateFilter.endDate.to : null;
  return { startDate, endDate };
};


