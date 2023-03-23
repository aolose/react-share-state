import { defineConfig } from 'vite'
import {resolve} from 'path'
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build:{
    lib:{
      entry:resolve(__dirname, 'src/index.ts'),
      name:'reactShareState',
      fileName:'index',
      formats:['es','cjs','umd']
    },
    rollupOptions:{
      external:['react']
    }
  }
})
