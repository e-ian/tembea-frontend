export const mockActivatedRoute = {
  snapshot: {
    queryParams: {
      token: 'authToken'
    }
  }
}

export const mockRouter = {
  navigate: () => { }
}

export const mockToastr = {
  success: () => { },
  error: () => { }
}

export const mockCookieService = {
  delete: () => { },
  set: () => { }
};
