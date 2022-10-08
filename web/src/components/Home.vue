<template>
  <a-row :gutter="16">
    <a-col :sm="24" :md="12" :lg="8">
      <a-card title="PigPrice">
        <Resource
          resourceKey="PigPrice"
          :showTable="false"
          :chartStyle="{ width: '100%' }"
          :chartOptions="chartOptions"
        />
      </a-card>
    </a-col>
    <a-col :sm="24" :md="12" :lg="8">
      <a-card title="UserRegisterCount">
        <Resource
          resourceKey="UserRegisterCount"
          :showTable="false"
          :chartStyle="chartStyle"
        />
      </a-card>
    </a-col>
  </a-row>
  <br />
  <a-row :gutter="16">
    <a-col span="16">
      <a-card title="PigPrice Big Chart">
        <Resource
          resourceKey="PigPriceFlat"
          :showTable="false"
          :chartStyle="chartStyle"
        />
      </a-card>
    </a-col>
  </a-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Resource } from 'fastgraph-vue'

const chartOptions = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' }
  },
  grid: {
    left: '0%',
    right: '0%',
    bottom: '0%',
    containLabel: true
  },
  yAxis: [
    {
      type: 'value',
      name: '生猪价格',
      position: 'left',
      axisLabel: {
        formatter: '{value} 元'
      }
    },
    {
      type: 'value',
      name: '玉米价格',
      position: 'right',
      min: 2000,
      axisLabel: {
        formatter: '{value} 元'
      }
    }
  ],
  series: [
    {
      name: '生猪价格',
      type: 'line',
      smooth: true,
      yAxisIndex: 0
    },
    {
      name: '玉米价格',
      type: 'bar',
      yAxisIndex: 1
    }
  ]
}

export default defineComponent({
  components: { Resource },

  setup() {
    return {
      chartOptions,
      chartStyle: { width: '100%', marginBottom: '-24px' }
    }
  }
})
</script>
