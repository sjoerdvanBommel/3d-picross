import tableChairMockData from '../mock-data/figures/table-chair.json';

export default class FigureServiceMock {
    getFigure() {
        return tableChairMockData;
    }
}