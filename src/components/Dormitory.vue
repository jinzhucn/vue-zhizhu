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
        v-model="searchForm.payTime"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="筛选租赁日期"
        @change="reloadTableData">
      </el-date-picker>
      <el-select
        v-model="searchForm.isReturn"
        placeholder="筛选押金信息"
        @change="reloadTableData"
        clearable>
        <el-option
          v-for="item in searchForm.returnOptions"
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
      v-loading="tableLoading"
      height="300px"
      element-loading-text="拼命加载中">
      <el-table-column prop="schoolName" label="学校"></el-table-column>
      <el-table-column prop="building" label="寝室楼"></el-table-column>
      <el-table-column prop="room" label="寝室号"></el-table-column>
      <el-table-column prop="genderDesc" label="性别"></el-table-column>
      <el-table-column prop="number" label="人数"></el-table-column>
      <el-table-column prop="payTime" label="起租时间"></el-table-column>
      <el-table-column prop="years" label="租赁年限"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="editDormitory(scope.row)"
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

    <el-dialog
      title="编辑寝室信息"
      :visible.sync="dialogVisible"
      width="400px">
      <el-form
        :model="dialogForm"
        label-width="120px"
      >
        <el-form-item label="学校">
          <label>{{dialogForm.schoolName}}</label>
        </el-form-item>
        <el-form-item label="寝室楼">
          <label>{{dialogForm.building}}</label>
        </el-form-item>
        <el-form-item label="寝室号">
          <label>{{dialogForm.room}}</label>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="dialogForm.gender">
            <el-radio label=0>男</el-radio>
            <el-radio label=1>女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="人数" class="input-item">
          <el-input-number v-model="dialogForm.number"
                           :min="1"
                           :max="8"
                           size="mini">
          </el-input-number>
        </el-form-item>
        <el-form-item label="租赁日期">
          <label>{{dialogForm.payTime}}</label>
        </el-form-item>
        <el-form-item label="租赁年限">
          <label>{{dialogForm.years}}</label>
        </el-form-item>
        <el-form-item label="付款人">
          <label>{{dialogForm.payStudent}}</label>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRoom">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { axiosByJson, axiosByKeyValue } from '../axios/index';

export default {
  name: 'Dormitory',
  data() {
    return {
      searchForm: {
        schoolName: '',
        building: '',
        room: '',
        payTime: '',
        isReturn: '',
        returnOptions: [
          {
            value: 0,
            label: '未退还',
          },
          {
            value: 1,
            label: '已退还',
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
      dialogVisible: false,
      dialogForm: {
        gender: '0',
        number: 1,
        payTime: '',
        years: 0,
        roomMember: [],
        payStudent: '',
      },
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
    updateRoom() {
      axiosByJson.post('updateRoom', {
        schoolName: this.dialogForm.schoolName,
        building: this.dialogForm.building,
        room: this.dialogForm.room,
        gender: parseInt(this.dialogForm.gender, 10),
        number: this.dialogForm.number,
      }).then(() => {
        this.dialogVisible = false;
        this.$message({
          type: 'success',
          message: '操作成功',
        });
      }).catch(() => {
        this.dialogVisible = false;
        this.$message({
          type: 'error',
          message: '系统异常',
        });
      });
    },
    reloadTableData() {
      this.tableLoading = true;
      axiosByJson.post('listRoomInfo', {
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
        schoolName: this.searchForm.schoolName,
        building: this.searchForm.building,
        room: this.searchForm.room,
        payTime: this.searchForm.payTime,
        isReturn: this.searchForm.isReturn,
      }).then(({ data: { data: { count, list } } }) => {
        list.forEach((val) => {
          Object.assign(val, {
            genderDesc: val.gender === 0 ? '男' : '女',
          });
        });
        this.tableData = list;
        this.pagination.total = count;
        this.tableLoading = false;
      });
    },
    editDormitory(row) {
      this.listRoomMember(row).then(() => {
        Object.assign(this.dialogForm, row, { gender: row.gender.toString() });
        this.dialogVisible = true;
      });
    },
    listRoomMember(room) {
      return axiosByJson.post('listRoomMember', {
        schoolName: room.schoolName,
        building: room.building,
        room: room.room,
      }).then(({ data: { data } }) => {
        this.dialogForm.roomMember = data;
        this.dialogForm.payStudent = data.filter(val => val.openid === room.openid)[0].stuName;
      });
    },
    downloadTable() {
      this.downloadLoading = true;
      axiosByJson.post('listRoomInfo', {
        pageNo: 0,
        pageSize: this.pagination.pageSize,
        schoolName: this.searchForm.schoolName,
        building: this.searchForm.building,
        room: this.searchForm.room,
        payTime: this.searchForm.payTime,
        isReturn: this.searchForm.isReturn,
      }).then(({ data: { data: { list } } }) => list).then((data) => {
        let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
        const header = '学校,楼层,寝室,性别,人数,租赁时间,租赁年限,租金,押金';
        csvContent += `${header}\r\n`;
        data.forEach((rowObj) => {
          const row = `${rowObj.schoolName},${rowObj.building},${rowObj.room},${rowObj.gender === 0 ? '男' : '女'},${rowObj.number},${rowObj.payTime},${rowObj.years},${rowObj.rent},${rowObj.deposit}`;
          csvContent += `${row}\r\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', '寝室.csv');
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

