import { observer } from 'mobx-react-lite';
import { meterStore } from '../store/metersStore';
import './MetersTable.css';
import HotWaterIcon from '../assets/icons/hot-water.svg';
import ColdWaterIcon from '../assets/icons/cold-water.svg';

const formatMeterType = (types: string[]) => {
  if (types.includes('HotWaterAreaMeter')) {
    return (
      <div className="meter-type">
        <img src={HotWaterIcon} alt="ГВС" />
        <span>ГВС</span>
      </div>
    );
  }

  if (types.includes('ColdWaterAreaMeter')) {
    return (
      <div className="meter-type">
        <img src={ColdWaterIcon} alt="ХВС" />
        <span>ХВС</span>
      </div>
    );
  }

  return '—';
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU');
};

const MetersTable = observer(() => {
  const totalPages = Math.ceil(meterStore.totalCount / meterStore.pageSize);

  const visiblePages: Array<number | string> =
    totalPages <= 4
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
      : [1, 2, 3, '...', totalPages];

  return (
    <section className="meters">
      <h2 className="meters__title">Список счётчиков</h2>

      <div className="meters__container">
        <div className="meters__table-wrapper">
          <table className="meters__table">
            <thead className="meters__thead">
              <tr>
                <th>№</th>
                <th>Тип</th>
                <th>Дата установки</th>
                <th>Автоматический</th>
                <th>Текущие показания</th>
                <th>Адрес</th>
                <th>Примечание</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {meterStore.meters.map((meter, index) => (
                <tr key={meter.id}>
                  <td>
                    {(meterStore.currentPage - 1) * meterStore.pageSize +
                      index +
                      1}
                  </td>

                  <td>{formatMeterType(meter._type)}</td>

                  <td>{formatDate(meter.installation_date)}</td>

                  <td>{meter.is_automatic ? 'да' : 'нет'}</td>

                  <td>{meter.initial_values.at(-1) ?? '—'}</td>

                  <td>
                    {meterStore.areas.get(meter.area.id) ?? 'Загрузка...'}
                  </td>

                  <td>{meter.description || '—'}</td>

                  <td className="actions-cell">
                    <button
                      type="button"
                      className="delete-button"
                      aria-label="Удалить счётчик"
                      onClick={() => meterStore.deleteMeter(meter.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          {visiblePages.map((item, index) => {
            if (item === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="pagination__ellipsis"
                >
                  ...
                </span>
              );
            }

            const page = item as number;

            return (
              <button
                type="button"
                key={page}
                className={
                  meterStore.currentPage === page
                    ? 'pagination__button pagination__button--active'
                    : 'pagination__button'
                }
                onClick={() => meterStore.setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default MetersTable;
