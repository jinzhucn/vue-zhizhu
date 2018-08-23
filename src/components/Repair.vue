<template>
    <div>
        <el-form :inline="true" class="selectForm">
            <el-select
              v-model="searchForm.schoolName"
              placeholder="筛选学校信息"
              @change="selectSchool"
              clearable>
                <el-option
                  v-for="item in searchForm.schoolOptions"
                  :key="item"
                  :value="item">
                </el-option>
            </el-select>
            <el-select
              v-model="searchForm.building"
              placeholder="筛选寝室楼信息"
              @change="selectBuilding"
              clearable>
                <el-option
                  v-for="item in searchForm.buildingOptions"
                  :key="item"
                  :value="item">
                </el-option>
            </el-select>
          <el-select
            v-model="searchForm.room"
            placeholder="筛选寝室信息"
            @change="reloadTableData"
            clearable>
            <el-option
              v-for="item in searchForm.roomOption"
              :key="item"
              :value="item">
            </el-option>
          </el-select>
            <el-date-picker
              v-model="searchForm.repairTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="筛选报修日期"
              @change="reloadTableData">
            </el-date-picker>
          <el-select
            v-model="searchForm.repairStatus"
            placeholder="筛选出工信息"
            @change="reloadTableData"
            clearable>
            <el-option
              v-for="item in searchForm.repairOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
            <el-button
              type="primary"
              @click="downloadTable"
              icon="el-icon-document"
              :loading="downloadLoading">
              下载
            </el-button>
        </el-form>
        <el-table
          :data="tableData"
          border
          stripe
          height="300px"
          v-loading="tableLoading"
          element-loading-text="拼命加载中">
            <el-table-column prop="schoolName" label="报修学校"></el-table-column>
            <el-table-column prop="building" label="报修楼层"></el-table-column>
            <el-table-column prop="room" label="报修寝室"></el-table-column>
            <el-table-column prop="repairDetail" label="报修详情"></el-table-column>
            <el-table-column label="报修人" width="80px">
                <template slot-scope="scope">
                    <el-popover trigger="hover" placement="top">
                      <p>姓名: {{ scope.row.stuName }}</p>
                      <p>联系电话: {{ scope.row.phoneNum }}</p>
                      <div slot="reference" class="name-wrapper">
                          <el-tag size="medium">{{ scope.row.stuName }}</el-tag>
                      </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="报修时间" width="180px">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 2px">{{ scope.row.repairTime }}</span>
                </template>
            </el-table-column>
          <el-table-column prop="repairStatusDesc" label="状态"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                      type="primary"
                      @click='editRepairStatus(scope.row)'
                      size="small"
                      icon="el-icon-edit">
                      编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
          @current-change="currentChange"
          @size-change="sizeChange"
          :page-sizes="[5, 10,15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total=pagination.total>
        </el-pagination>
    </div>
</template>

<script>
import { axiosByJson, axiosByKeyValue } from '../axios/index';

export default {
  name: 'Repair',
  data() {
    return {
      searchForm: {
        repairStatus: '',
        schoolName: '',
        building: '',
        room: '',
        repairTime: '',
        repairOptions: [
          {
            value: 0,
            label: '未出工',
          },
          {
            value: 1,
            label: '已出工',
          },
        ],
        schoolOptions: [],
        buildingOptions: [],
        roomOption: [],
      },
      tableData: [],
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableLoading: false,
      downloadLoading: false,
    };
  },
  methods: {
    initSchoolOption() {
      axiosByJson.post('listSchool').then(({ data: { data } }) => {
        this.searchForm.schoolOptions = data;
      });
    },
    initBuildingOption() {
      axiosByKeyValue.post('listBuilding', {
        schoolName: this.searchForm.schoolName,
      }).then(({ data: { data } }) => {
        this.searchForm.buildingOptions = data;
      });
    },
    initRoomOption() {
      axiosByKeyValue.post('listRoom', {
        schoolName: this.searchForm.schoolName,
        building: this.searchForm.building,
      }).then(({ data: { data } }) => {
        this.searchForm.roomOption = data;
      });
    },
    sizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.reloadTableData();
    },
    currentChange(currentPage) {
      this.pagination.pageNo = currentPage;
      this.reloadTableData();
    },
    selectSchool(value) {
      this.searchForm.building = '';
      this.reloadTableData();
      if (value === '') {
        this.searchForm.buildingOptions = [];
      } else {
        this.initBuildingOption();
      }
    },
    selectBuilding(value) {
      this.searchForm.room = '';
      this.reloadTableData();
      if (value === '') {
        this.searchForm.roomOption = [];
      } else {
        this.initRoomOption();
      }
    },
    editRepairStatus(row) {
      if (!row.repairStatus) {
        this.$confirm('确认修改状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.updateRepair(row);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          });
        });
      } else {
        this.$message('状态确定已完成');
      }
    },
    updateRepair(row) {
      axiosByJson.post('updateRepair', {
        repairid: row.repairid,
        repairStatus: !row.repairStatus,
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功',
        });
        this.reloadTableData();
      });
    },
    reloadTableData() {
      this.tableLoading = true;
      axiosByJson.post('listRepair', {
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
        schoolName: this.searchForm.schoolName,
        building: this.searchForm.building,
        room: this.searchForm.room,
        repairTime: this.searchForm.repairTime,
        repairStatus: this.searchForm.repairStatus,
      }).then(({ data: { data: { count, list } } }) => {
        list.forEach((val) => {
          Object.assign(val, {
            repairStatusDesc: val.repairStatus ? '已出工' : '待出工',
          });
        });
        this.tableData = list;
        this.pagination.total = count;
        this.tableLoading = false;
      });
    },
    downloadTable() {
      this.downloadLoading = true;
      axiosByJson.post('listRepair', {
        pageNo: 0,
        pageSize: this.pagination.pageSize,
        schoolName: this.searchForm.schoolName,
        building: this.searchForm.building,
        room: this.searchForm.room,
        repairTime: this.searchForm.repairTime,
        repairStatus: this.searchForm.repairStatus,
      }).then(({ data: { data: { list } } }) => list).then((data) => {
        let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
        const header = '学校,楼层,寝室,报修详情,报修人,联系方式,报修时间,状态';
        csvContent += `${header}\r\n`;
        data.forEach((rowObj) => {
          const row = `${rowObj.schoolName},${rowObj.building},${rowObj.room},${rowObj.repairDetail},${rowObj.stuName},${rowObj.phoneNum},${rowObj.repairTime},${rowObj.repairStatus === false ? '未出工' : '已出工'}`;
          csvContent += `${row}\r\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', '报修.csv');
        document.body.appendChild(link);
        link.click();
        this.downloadLoading = false;
      });
    },
  },
  created() {
    this.reloadTableData();
    this.initSchoolOption();
  },
};
</script>

<style scoped>
  .selectForm {
    text-align: center;
    margin-bottom: 15px;
  }
</style>
