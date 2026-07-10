'use client';

import { useState, useEffect } from 'react';

let cachedDatabaseData = null;
let inFlightDatabasePromise = null;

async function fetchDatabaseDataSingleton() {
  if (cachedDatabaseData) {
    return cachedDatabaseData;
  }
  if (inFlightDatabasePromise) {
    return inFlightDatabasePromise;
  }

  inFlightDatabasePromise = (async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products?limit=500').then((r) => r.json()),
        fetch('/api/categories').then((r) => r.json()),
      ]);

      let dbPrintingProducts = [];
      let dbGraphicProducts = [];
      if (prodRes?.success && Array.isArray(prodRes.data)) {
        const allProducts = prodRes.data;
        dbPrintingProducts = allProducts.filter((p) => p.serviceType === 'printing');
        dbGraphicProducts = allProducts.filter((p) => p.serviceType === 'graphic');
      }

      let dbPrintingCategories = [];
      let dbGraphicCategories = [];
      if (catRes?.success && Array.isArray(catRes.data)) {
        dbPrintingCategories = catRes.data.filter((c) => c.serviceType === 'printing');
        dbGraphicCategories = catRes.data.filter((c) => c.serviceType === 'graphic');
      }

      const result = {
        printingCategories: dbPrintingCategories,
        graphicCategories: dbGraphicCategories,
        printingServicesList: dbPrintingProducts,
        graphicServicesList: dbGraphicProducts,
        loading: false,
        fromDatabase: true,
      };

      cachedDatabaseData = result;
      return result;
    } finally {
      inFlightDatabasePromise = null;
    }
  })();

  return inFlightDatabasePromise;
}

export function useDatabaseData() {
  const [data, setData] = useState(() => {
    if (cachedDatabaseData) {
      return cachedDatabaseData;
    }
    return {
      printingCategories: [],
      graphicCategories: [],
      printingServicesList: [],
      graphicServicesList: [],
      loading: true,
      fromDatabase: false,
    };
  });

  useEffect(() => {
    let isMounted = true;

    if (cachedDatabaseData) {
      return;
    }

    fetchDatabaseDataSingleton()
      .then((res) => {
        if (isMounted && res) {
          setData(res);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch from database:', err);
        if (isMounted) {
          setData((prev) => ({ ...prev, loading: false }));
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
}
