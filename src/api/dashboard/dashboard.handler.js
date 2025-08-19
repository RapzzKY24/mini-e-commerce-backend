class DashboardHandler {
  constructor(service) {
    this._service = service;

    this.getDashboardDataHandler = this.getDashboardDataHandler.bind(this);
    this.getProductsSoldHandler = this.getProductsSoldHandler.bind(this);
    this.getTotalProfitHandler = this.getTotalProfitHandler.bind(this);
    this.getDailySalesHandler = this.getDailySalesHandler.bind(this);
    this.getRevenueByProductHandler =
      this.getRevenueByProductHandler.bind(this);
    this.getDashboardSummaryHandler =
      this.getDashboardSummaryHandler.bind(this);
  }

  async getDashboardDataHandler() {
    const dataDashboard = await this._service.getDashboardData();
    return {
      status: "success",
      message: "Berhasil mendapatkan semua data dashboard",
      data: dataDashboard,
    };
  }

  async getProductsSoldHandler() {
    const productsSold = await this._service.getProductsSold();
    return {
      status: "success",
      message: "Berhasil mendapatkan data produk terjual",
      data: productsSold,
    };
  }

  async getTotalProfitHandler() {
    const totalProfit = await this._service.getTotalProfit();
    return {
      status: "success",
      message: "Berhasil mendapatkan total profit",
      data: { totalProfit },
    };
  }

  async getDailySalesHandler() {
    const dailySales = await this._service.getDailySales();
    return {
      status: "success",
      message: "Berhasil mendapatkan data penjualan harian",
      data: dailySales,
    };
  }

  async getRevenueByProductHandler() {
    const revenueByCategory = await this._service.getRevenueByProduct();
    return {
      status: "success",
      message: "Berhasil mendapatkan data revenue per kategori",
      data: revenueByCategory,
    };
  }

  async getDashboardSummaryHandler() {
    const summary = await this._service.getDashboardSummary();
    return {
      status: "success",
      message: "Berhasil mendapatkan ringkasan dashboard",
      data: summary,
    };
  }
}

module.exports = DashboardHandler;
