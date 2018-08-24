<template>
  <div>
      <el-form :inline="true" class="selectForm">
        <el-select
          v-model="searchForm.schoolName"
          placeholder="筛选学校信息"
          clearable
          @change="selectSchool">
            <el-option
              v-for="item in searchForm.schoolOptions"
              :key="item"
              :value="item">
            </el-option>
        </el-select>
        <el-select
          v-model="searchForm.building"
          placeholder="筛选楼层信息"
          clearable
          @change="selectBuilding">
            <el-option
              v-for="item in searchForm.buildingOptions"
              :key="item"
              :value="item">
            </el-option>
        </el-select>
        <el-select
          v-model="searchForm.room"
          placeholder="筛选寝室信息"
          clearable
          @change="selectRoom">
            <el-option
              v-for="item in searchForm.roomOptions"
              :key="item"
              :value="item">
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
        stripe
        border
        height="300px"
        v-loading="tableLoading"
        element-loading-text="拼命加载中">
        <el-table-column prop="schoolName" label="学校"></el-table-column>
        <el-table-column prop="college" label="学院"></el-table-column>
        <el-table-column prop="major" label="专业"></el-table-column>
        <el-table-column prop="stuid" label="身份证号" width="185px"></el-table-column>
        <el-table-column prop="stuName" label="姓名" width="90px"></el-table-column>
        <el-table-column prop="gender" label="性别" width="65px"></el-table-column>
        <el-table-column prop="phoneNum" label="手机号" width="140px"></el-table-column>
        <el-table-column prop="building" label="寝室楼"></el-table-column>
        <el-table-column prop="room" label="寝室号" width="70px"></el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="editStudent(scope.row)"
              icon="el-icon-edit">
              编辑
            </el-button>
              <el-button
                type="danger"
                size="small"
                @click="deleteRow(scope.row)"
                icon="el-icon-delete">
                删除
              </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="currentChange"
        @size-change="sizeChange"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total=pagination.total>
      </el-pagination>
      <el-dialog
        title="编辑学生信息"
        :visible.sync="dialogVisible"
        width="400px">
        <el-form
          ref="dialogForm"
          :rules="rules"
          :model="dialogForm"
          label-width="120px">
          <el-form-item label="姓名">
            <label>{{dialogForm.stuName}}</label>
          </el-form-item>
          <el-form-item label="身份证号">
            <label>{{dialogForm.stuid}}</label>
          </el-form-item>
          <el-form-item label="联系方式">
            <label>{{dialogForm.phoneNum}}</label>
          </el-form-item>
          <el-form-item label="性别">
            <label>{{dialogForm.gender}}</label>
          </el-form-item>
          <el-form-item label="学校">
            <label>{{dialogForm.schoolName}}</label>
          </el-form-item>
          <el-form-item label="学院">
            <label>{{dialogForm.college}}</label>
          </el-form-item>
          <el-form-item label="专业">
            <label>{{dialogForm.major}}</label>
          </el-form-item>
          <el-form-item label="寝室楼" prop="building" class="input-item">
            <el-select
              v-model="dialogForm.building"
              placeholder="请选择寝室楼"
              @change="selectDialogBuilding">
              <el-option
                v-for="item in dialogForm.buildingOptions"
                :value="item"
                :key="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="寝室号" prop="room" class="input-item">
            <el-select v-model="dialogForm.room" placeholder="请选择寝室号">
              <el-option
                v-for="item in dialogForm.roomOptions"
                :value="item"
                :key="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateStudent">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { axiosByJson, axiosByKeyValue } from '../axios/index';

export default {
  name: 'Student',
  data() {
    return {
      rules: {
        building: [
          { required: true, message: '寝室楼不能为空', trigger: 'blur' },
        ],
        room: [{ required: true, message: '寝室不能为空', trigger: 'blur' }],
      },
      searchForm: {
        schoolName: '',
        building: '',
        room: '',
        schoolOptions: [],
        buildingOptions: [],
        roomOptions: [],
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
        building: '',
        room: '',
        buildingOptions: [],
        roomOptions: [],
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
        this.searchForm.roomOptions = data;
      });
    },
    initDialogBuildingOption() {
      axiosByKeyValue.post('listBuilding', {
        schoolName: this.dialogForm.schoolName,
      }).then(({ data: { data } }) => {
        this.dialogForm.buildingOptions = data;
      });
    },
    initDialogRoomOption() {
      axiosByKeyValue.post('listRoom', {
        schoolName: this.dialogForm.schoolName,
        building: this.dialogForm.building,
      }).then(({ data: { data } }) => {
        this.dialogForm.roomOptions = data;
      });
    },
    selectDialogBuilding() {
      this.dialogForm.room = '';
      this.initDialogRoomOption();
    },
    selectSchool(value) {
      this.building = '';
      this.room = '';
      this.reloadTableData();
      if (value === '') {
        this.searchForm.buildingOptions = [];
        this.searchForm.roomOptions = [];
      } else {
        this.initBuildingOption();
      }
    },
    selectBuilding(value) {
      this.room = '';
      this.reloadTableData();
      if (value === '') {
        this.searchForm.roomOptions = [];
      } else {
        this.initRoomOption();
      }
    },
    selectRoom() {
      this.reloadTableData();
    },
    sizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.reloadTableData();
    },
    currentChange(currentPage) {
      this.pagination.pageNo = currentPage;
      this.reloadTableData();
    },
    reloadTableData() {
      this.tableLoading = true;
      axiosByJson.post('listStudent', {
        pageSize: this.pagination.pageSize,
        pageNo: this.pagination.pageNo,
        schoolName: this.searchForm.schoolName,
        building: this.searchForm.building,
        room: this.searchForm.room,
      }).then(({ data: { data: { count, list } } }) => {
        list.forEach((data) => {
          const gender = data.gender === 0 ? '男' : '女';
          Object.assign(data, { gender });
        });
        this.tableData = list;
        this.pagination.total = count;
        this.tableLoading = false;
      });
    },
    editStudent(row) {
      Object.assign(this.dialogForm, row);
      this.initDialogBuildingOption();
      this.initDialogRoomOption();
      // this.dialogForm = row;
      this.dialogVisible = true;
    },
    updateStudent() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          axiosByJson.post('updateStudent', {
            openid: this.dialogForm.openid,
            building: this.dialogForm.building,
            room: this.dialogForm.room,
          }).then(({ data: { code } }) => {
            if (code === 1) {
              this.dialogVisible = false;
              this.$message.success('编辑学生信息成功');
            }
          });
        }
      });
    },
    deleteRow(row) {
      this.prompt(row.openid);
    },
    prompt(openid) {
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '密码不能为空',
        inputType: 'password',
      }).then(({ value }) => {
        if (value === sessionStorage.getItem('password')) {
          axiosByKeyValue.post('deleteStudent', {
            openid,
          }).then(() => {
            this.reloadTableData();
          });
          this.$message({
            type: 'success',
            message: '操作成功',
          });
        } else {
          this.$message({
            type: 'error',
            message: '密码不正确',
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消',
        });
      });
    },
    downloadTable() {
      this.downloadLoading = true;
      axiosByJson.post('listStudent', {
        pageSize: this.pagination.pageSize,
        pageNo: 0,
        schoolName: this.searchForm.schoolName,
        building: this.searchForm.building,
        room: this.searchForm.room,
      }).then(({ data: { data: { list } } }) => {
        list.forEach((data) => {
          const gender = data.gender === 0 ? '男' : '女';
          Object.assign(data, gender);
        });
        return list;
      }).then((data) => {
        let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
        const header = '学校,学院,专业,寝室楼,寝室,身份证号,姓名,性别,手机号';
        csvContent += `${header}\r\n`;
        data.forEach((rowObj) => {
          const row = `${rowObj.schoolName},${rowObj.college},${rowObj.major},${rowObj.building},${rowObj.room},${rowObj.stuid}\t,${rowObj.stuName},${rowObj.gender},${rowObj.phoneNum}`;
          csvContent += `${row}\r\n`;
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', '学生.csv');
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
