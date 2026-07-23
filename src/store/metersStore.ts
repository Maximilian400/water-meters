import { cast, flow, types } from 'mobx-state-tree';
import type { MeterResponse } from '../types/meter';
import { getAreas } from '../api/areas';
import type { AreasResponse } from '../api/areas';
import { getMeters, deleteMeter } from '../api/meters';

export const MeterModel = types.model('Meter', {
  id: types.identifier,
  _type: types.array(types.string),
  area: types.model({
    id: types.identifier,
  }),
  is_automatic: types.maybeNull(types.boolean),
  communication: types.string,
  description: types.string,
  serial_number: types.string,
  installation_date: types.string,
  brand_name: types.maybeNull(types.string),
  model_name: types.maybeNull(types.string),
  initial_values: types.array(types.number),
});

export const MeterStore = types
  .model('MeterStore', {
    meters: types.array(MeterModel),
    areas: types.map(types.string),
    loading: types.boolean,
    error: types.maybeNull(types.string),
    currentPage: types.number,
    totalCount: types.number,
    pageSize: types.number,
  })

  .actions((self) => ({
    loadAreas: flow(function* loadAreas() {
      const unknownAreaIds = [
        ...new Set(
          self.meters
            .map((meter) => meter.area.id)
            .filter((areaId) => !self.areas.has(areaId))
        ),
      ];

      if (unknownAreaIds.length === 0) {
        return;
      }

      const data: AreasResponse = yield getAreas(unknownAreaIds);

      data.results.forEach((area) => {
        const fullAddress = `${area.house.address}, ${area.str_number_full}`;

        self.areas.set(area.id, fullAddress);
      });
    }),
  }))

  .actions((self) => ({
    loadMeters: flow(function* loadMeters(showLoader = true) {
      if (showLoader) {
        self.loading = true;
      }

      self.error = null;

      try {
        const offset = (self.currentPage - 1) * self.pageSize;

        const data: MeterResponse = yield getMeters(self.pageSize, offset);

        self.totalCount = data.count;

        self.meters = cast(data.results);

        yield self.loadAreas();
      } catch (error) {
        self.error =
          error instanceof Error
            ? error.message
            : 'Произошла неизвестная ошибка';
      } finally {
        if (showLoader) {
          self.loading = false;
        }
      }
    }),
    deleteMeter: flow(function* deleteMeterAction(meterId: string) {
      try {
        yield deleteMeter(meterId);

        yield self.loadMeters(false);
      } catch (error) {
        self.error =
          error instanceof Error ? error.message : 'Не удалось удалить счётчик';
      }
    }),
    setCurrentPage(page: number) {
      self.currentPage = page;
      self.loadMeters(false);
    },
  }));

export const meterStore = MeterStore.create({
  meters: [],
  areas: {},
  loading: false,
  error: null,
  currentPage: 1,
  totalCount: 0,
  pageSize: 20,
});
