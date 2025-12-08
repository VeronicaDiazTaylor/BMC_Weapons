// ========== Embedded Source Map ==========
globalThis.__SOURCE_MAP__ = {"version":3,"sources":["../../src/weapon/weaponRegistry.ts","../../node_modules/@gollilla/keystone/dist/index.js","../../src/weapon/weaponListener.ts","../../src/weapon/weapon.ts","../../src/weapon/bmc/airride.ts"],"sourcesContent":["import { Weapon } from './weapon';\n\nconst registry = new Map<string, Weapon>();\n\nexport function register(item: Weapon) {\n  registry.set(item.typeId, item);\n}\n\nexport function getWeapon(typeId: string): Weapon | undefined {\n  return registry.get(typeId);\n}\n\nexport function getAllWeapon(): Map<string, Weapon> {\n  return registry;\n}\n","import { world, system } from \"@minecraft/server\";\nclass Keystone {\n  constructor() {\n  }\n}\nconst keystone = new Keystone();\nclass Vector3 {\n  constructor(x, y, z) {\n    this.x = x;\n    this.y = y;\n    this.z = z;\n  }\n  /**\n   * ゼロベクトルで生成\n   * @return {Vector3}\n   */\n  static zero() {\n    return new Vector3(0, 0, 0);\n  }\n  /**\n   * {x, y, z} オブジェクトから生成\n   * @param {_Vector3} pos \n   * @returns \n   */\n  static fromBDS(pos) {\n    return new Vector3(pos.x, pos.y, pos.z);\n  }\n  // ===== 基本ゲッター =====\n  getX() {\n    return this.x;\n  }\n  getY() {\n    return this.y;\n  }\n  getZ() {\n    return this.z;\n  }\n  getFloorX() {\n    return Math.floor(this.x);\n  }\n  getFloorY() {\n    return Math.floor(this.y);\n  }\n  getFloorZ() {\n    return Math.floor(this.z);\n  }\n  /**\n   * 加算\n   * @param {number} x \n   * @param {number} y \n   * @param {number} z \n   * @return {Vector3}\n   */\n  add(x, y, z) {\n    return new Vector3(\n      this.x + x,\n      this.y + y,\n      this.z + z\n    );\n  }\n  /**\n   * ベクトル単位での加算\n   * @param {_Vector3} v \n   * @returns {Vector3}\n   */\n  addVector(v) {\n    return this.add(v.x, v.y, v.z);\n  }\n  /**\n   * 減算\n   * @param {number} x\n   * @param {number} y\n   * @param {number} z\n   * @return {Vector3}\n   */\n  subtract(x, y, z) {\n    return this.add(-x, -y, -z);\n  }\n  /**\n   * ベクトル単位での減算\n   * @param {_Vector3} v\n   * @return {Vector3}\n   */\n  subtractVector(v) {\n    return this.add(-v.x, -v.y, -v.z);\n  }\n  /**\n   * 乗算\n   * @param {number} value\n   * @return {Vector3}\n   */\n  multiply(value) {\n    return new Vector3(\n      this.x * value,\n      this.y * value,\n      this.z * value\n    );\n  }\n  /**\n   * 除算\n   * @param {number} value\n   * @return {Vector3}\n   */\n  divide(value) {\n    return new Vector3(\n      this.x / value,\n      this.y / value,\n      this.z / value\n    );\n  }\n  /**\n   * ベクトルの内部数値小数点切り上げ\n   * @return {Vector3}\n   */\n  ceil() {\n    return new Vector3(\n      Math.ceil(this.x),\n      Math.ceil(this.y),\n      Math.ceil(this.z)\n    );\n  }\n  /**\n   * ベクトルの内部数値小数点切り捨て\n   * @return {Vector3}\n   */\n  floor() {\n    return new Vector3(\n      Math.floor(this.x),\n      Math.floor(this.y),\n      Math.floor(this.z)\n    );\n  }\n  /**\n   * ベクトルの内部数値小数点四捨五入\n   * @param {number} precision\n   * @return {Vector3}\n   */\n  round(precision = 0) {\n    const factor = Math.pow(10, precision);\n    return new Vector3(\n      Math.round(this.x * factor) / factor,\n      Math.round(this.y * factor) / factor,\n      Math.round(this.z * factor) / factor\n    );\n  }\n  /**\n   * ベクトルの内部数値の絶対値\n   * @return {Vector3}\n   */\n  abs() {\n    return new Vector3(\n      Math.abs(this.x),\n      Math.abs(this.y),\n      Math.abs(this.z)\n    );\n  }\n  /**\n   * 指定した2点間のユークリッド距離\n   * @param {_Vector3} pos \n   * @return {number}\n   */\n  distance(pos) {\n    return Math.sqrt(this.distanceSquared(pos));\n  }\n  /**\n   * 指定した2点間のユークリッド距離の2乗\n   * @param {_Vector3} pos \n   * @return {number}\n   */\n  distanceSquared(pos) {\n    const dx = this.x - pos.x;\n    const dy = this.y - pos.y;\n    const dz = this.z - pos.z;\n    return dx * dx + dy * dy + dz * dz;\n  }\n  /**\n   * 内積\n   * @param {_Vector3} pos \n   * @return {number}\n   */\n  dot(pos) {\n    return this.x * pos.x + this.y * pos.y + this.z * pos.z;\n  }\n  /**\n   * 外積\n   * @param {_Vector3} pos \n   * @return {Vector3}\n   */\n  cross(pos) {\n    return new Vector3(\n      this.y * pos.z - this.z * pos.y,\n      this.z * pos.x - this.x * pos.z,\n      this.x * pos.y - this.y * pos.x\n    );\n  }\n  /**\n   * ベクトルの比較\n   * @param {_Vector3} pos \n   * @return {boolean}\n   */\n  equals(pos) {\n    return this.x === pos.x && this.y === pos.y && this.z === pos.z;\n  }\n  /**\n   * ベクトルの長さ\n   * @return {number}\n   */\n  length() {\n    return Math.sqrt(this.lengthSquared());\n  }\n  /**\n   * ベクトルの長さの2乗\n   * @return {number}\n   */\n  lengthSquared() {\n    return this.x * this.x + this.y * this.y + this.z * this.z;\n  }\n  /**\n   * 正規化\n   * @return {Vector3}\n   */\n  normalize() {\n    const len = this.length();\n    if (len > 0) {\n      return this.divide(len);\n    }\n    return new Vector3(0, 0, 0);\n  }\n  /**\n   * オブジェクトの数値指定再生成\n   * @param {number} x \n   * @param {number} y \n   * @param {number} z \n   * @return {Vector3}\n   */\n  withComponents(x, y, z) {\n    return new Vector3(\n      x !== void 0 ? x : this.x,\n      y !== void 0 ? y : this.y,\n      z !== void 0 ? z : this.z\n    );\n  }\n  /**\n   * BDS ScriptAPIで使える {x, y, z} 形式に変換\n   * @returns {_Vector3}\n   */\n  toBDS() {\n    return { x: this.x, y: this.y, z: this.z };\n  }\n  /** 通常のオブジェクトに変換 */\n  toObject() {\n    return { x: this.x, y: this.y, z: this.z };\n  }\n  toString() {\n    return `_Vector3(x=${this.x}, y=${this.y}, z=${this.z})`;\n  }\n  /**\n   * 最大点\n   * @param {_Vector3} vector\n   * @param {_Vector3[]} vectors \n   * @returns {Vector3}\n   */\n  static maxComponents(vector, ...vectors) {\n    let x = vector.x;\n    let y = vector.y;\n    let z = vector.z;\n    for (const pos of vectors) {\n      x = Math.max(x, pos.x);\n      y = Math.max(y, pos.y);\n      z = Math.max(z, pos.z);\n    }\n    return new Vector3(x, y, z);\n  }\n  /**\n   * 最小点\n   * @param {_Vector3} vector\n   * @param {_Vector3[]} vectors \n   * @returns {Vector3}\n   */\n  static minComponents(vector, ...vectors) {\n    let x = vector.x;\n    let y = vector.y;\n    let z = vector.z;\n    for (const pos of vectors) {\n      x = Math.min(x, pos.x);\n      y = Math.min(y, pos.y);\n      z = Math.min(z, pos.z);\n    }\n    return new Vector3(x, y, z);\n  }\n  /**\n   * 合計\n   * @param {_Vector3[]} vectors\n   * @returns {Vector3}\n   */\n  static sum(...vectors) {\n    let x = 0, y = 0, z = 0;\n    for (const v of vectors) {\n      x += v.x;\n      y += v.y;\n      z += v.z;\n    }\n    return new Vector3(x, y, z);\n  }\n}\nvar Priority = /* @__PURE__ */ ((Priority2) => {\n  Priority2[Priority2[\"LOWEST\"] = 5] = \"LOWEST\";\n  Priority2[Priority2[\"LOW\"] = 4] = \"LOW\";\n  Priority2[Priority2[\"NORMAL\"] = 3] = \"NORMAL\";\n  Priority2[Priority2[\"HIGH\"] = 2] = \"HIGH\";\n  Priority2[Priority2[\"HIGHEST\"] = 1] = \"HIGHEST\";\n  Priority2[Priority2[\"MONITOR\"] = 0] = \"MONITOR\";\n  return Priority2;\n})(Priority || {});\nconst _EventManager = class _EventManager {\n  /** init: world.beforeEvents / world.afterEvents を全自動で subscribe して dispatch に流す */\n  static initialize() {\n    for (const name in world.afterEvents) {\n      world.afterEvents[name].subscribe((ev) => {\n        _EventManager.dispatchAfter(name, ev);\n      });\n    }\n    for (const name in world.beforeEvents) {\n      world.beforeEvents[name].subscribe((ev) => {\n        _EventManager.dispatchBefore(name, ev);\n      });\n    }\n  }\n  // ---------- register ----------\n  static registerAfter(eventName, listener) {\n    if (!this.afterListeners[eventName]) {\n      this.afterListeners[eventName] = [];\n    }\n    const arr = this.afterListeners[eventName];\n    arr.push(listener);\n    arr.sort((a, b) => (b.priority ?? Priority.NORMAL) - (a.priority ?? Priority.NORMAL));\n  }\n  static registerBefore(eventName, listener) {\n    if (!this.beforeListeners[eventName]) {\n      this.beforeListeners[eventName] = [];\n    }\n    const arr = this.beforeListeners[eventName];\n    arr.push(listener);\n    arr.sort((a, b) => (b.priority ?? Priority.NORMAL) - (a.priority ?? Priority.NORMAL));\n  }\n  // ---------- dispatch ----------\n  static dispatchAfter(eventName, event) {\n    const arr = this.afterListeners[eventName];\n    if (!arr) return;\n    for (const listener of arr) {\n      try {\n        listener.handler(event);\n      } catch (e) {\n        console.error(`[EventManager] after:${String(eventName)} handler threw:`, e);\n      }\n    }\n  }\n  static dispatchBefore(eventName, event) {\n    const arr = this.beforeListeners[eventName];\n    if (!arr) return;\n    for (const listener of arr) {\n      try {\n        listener.handler(event);\n      } catch (e) {\n        console.error(`[EventManager] before:${String(eventName)} handler threw:`, e);\n      }\n    }\n  }\n  // ---------- utility ----------\n  /** 登録済みリスナーを全部クリア（Plugin 単位で実装するなら拡張する） */\n  static clearAll() {\n    this.afterListeners = {};\n    this.beforeListeners = {};\n  }\n};\n_EventManager.afterListeners = {};\n_EventManager.beforeListeners = {};\nlet EventManager = _EventManager;\nconst COLOR = {\n  reset: \"\\x1B[0m\",\n  bold: \"\\x1B[1m\",\n  dim: \"\\x1B[2m\",\n  red: \"\\x1B[31m\",\n  green: \"\\x1B[32m\",\n  yellow: \"\\x1B[33m\",\n  blue: \"\\x1B[34m\",\n  magenta: \"\\x1B[35m\",\n  cyan: \"\\x1B[36m\",\n  white: \"\\x1B[37m\",\n  gray: \"\\x1B[90m\"\n};\nconst _VLQDecoder = class _VLQDecoder {\n  static decode(str) {\n    const result = [];\n    let shift = 0;\n    let value = 0;\n    for (let i = 0; i < str.length; i++) {\n      const digit = this.BASE64_CHARS.indexOf(str[i]);\n      if (digit === -1) continue;\n      const continuation = (digit & 32) !== 0;\n      value += (digit & 31) << shift;\n      if (continuation) {\n        shift += 5;\n      } else {\n        const negative = (value & 1) !== 0;\n        value >>>= 1;\n        result.push(negative ? -value : value);\n        value = 0;\n        shift = 0;\n      }\n    }\n    return result;\n  }\n};\n_VLQDecoder.BASE64_CHARS = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/\";\nlet VLQDecoder = _VLQDecoder;\nclass SourceMapDebugger {\n  constructor() {\n    this.decodedMappings = [];\n    this.initialized = false;\n    this.initialize();\n  }\n  initialize() {\n    if (typeof globalThis.__SOURCE_MAP__ !== \"undefined\") {\n      this.sourceMap = globalThis.__SOURCE_MAP__;\n      this.decodeMappings();\n      this.initialized = true;\n    }\n  }\n  decodeMappings() {\n    if (!this.sourceMap?.mappings) return;\n    const lines = this.sourceMap.mappings.split(\";\");\n    let generatedLine = 1;\n    let prevOriginalLine = 0;\n    let prevOriginalColumn = 0;\n    let prevSource = 0;\n    let prevName = 0;\n    for (const line of lines) {\n      if (!line) {\n        generatedLine++;\n        continue;\n      }\n      const segments = line.split(\",\");\n      let generatedColumn = 0;\n      for (const segment of segments) {\n        if (!segment) continue;\n        const decoded = VLQDecoder.decode(segment);\n        if (decoded.length < 1) continue;\n        generatedColumn += decoded[0];\n        const mapping = {\n          generatedLine,\n          generatedColumn,\n          originalLine: 0,\n          originalColumn: 0,\n          sourceIndex: 0\n        };\n        if (decoded.length > 1) {\n          prevSource += decoded[1];\n          mapping.sourceIndex = prevSource;\n          if (decoded.length > 2) {\n            prevOriginalLine += decoded[2];\n            mapping.originalLine = prevOriginalLine;\n            if (decoded.length > 3) {\n              prevOriginalColumn += decoded[3];\n              mapping.originalColumn = prevOriginalColumn;\n              if (decoded.length > 4) {\n                prevName += decoded[4];\n                mapping.name = this.sourceMap.names?.[prevName];\n              }\n            }\n          }\n        }\n        this.decodedMappings.push(mapping);\n      }\n      generatedLine++;\n    }\n  }\n  getOriginalPosition(line, column) {\n    if (!this.initialized || this.decodedMappings.length === 0) return null;\n    let best = null;\n    let bestDistance = Infinity;\n    for (const m of this.decodedMappings) {\n      if (m.generatedLine === line) {\n        const distance = column !== void 0 ? Math.abs(m.generatedColumn - column) : 0;\n        if (distance < bestDistance) {\n          bestDistance = distance;\n          best = m;\n        }\n      } else if (m.generatedLine < line) {\n        if (!best || m.generatedLine > best.generatedLine) best = m;\n      }\n    }\n    if (best && this.sourceMap.sources?.[best.sourceIndex]) {\n      return {\n        source: this.sourceMap.sources[best.sourceIndex],\n        line: best.originalLine,\n        column: best.originalColumn,\n        content: this.sourceMap.sourcesContent?.[best.sourceIndex],\n        name: best.name\n      };\n    }\n    return null;\n  }\n  debug(...args) {\n    try {\n      const err = new Error();\n      const stack = err.stack || \"\";\n      const stackLines = stack.split(\"\\n\");\n      const output = [];\n      output.push(`${COLOR.yellow}━━━━━━━━━━━━━━━━━━━━━━${COLOR.reset}`);\n      output.push(`${COLOR.bold}${COLOR.cyan}📍 DEBUG${COLOR.reset}`);\n      let position = null;\n      for (let i = 2; i < Math.min(stackLines.length, 8); i++) {\n        const line = stackLines[i];\n        console.log(JSON.stringify(line));\n        const match = /(?:\\()?(?:[A-Za-z0-9._/-]+):(\\d+)(?::(\\d+))?\\)?$/.exec(line);\n        if (match) {\n          const lineNum = parseInt(match[1]);\n          const colNum = match[2] ? parseInt(match[2]) : void 0;\n          position = this.getOriginalPosition(lineNum, colNum);\n          if (position) break;\n        }\n      }\n      if (position) {\n        const file = position.source.replace(/^.*\\//, \"\");\n        output.push(`${COLOR.blue}📄 ${file}:${position.line}:${position.column}${COLOR.reset}`);\n        if (position.name) output.push(`${COLOR.cyan}🏷 ${position.name}${COLOR.reset}`);\n        if (position.content) {\n          const lines = position.content.split(\"\\n\");\n          const target = position.line - 1;\n          const range = 2;\n          output.push(`${COLOR.gray}─────────────────────${COLOR.reset}`);\n          for (let i = Math.max(0, target - range); i <= Math.min(lines.length - 1, target + range); i++) {\n            const num = `${(i + 1).toString().padStart(3, \" \")}`;\n            const content = lines[i];\n            if (i === target) {\n              output.push(`${COLOR.red}${COLOR.bold}→ ${num}: ${COLOR.white}${content}${COLOR.reset}`);\n            } else {\n              output.push(`${COLOR.gray}  ${num}: ${content}${COLOR.reset}`);\n            }\n          }\n        }\n      } else {\n        output.push(`${COLOR.gray}📍 Location: (source map not available)${COLOR.reset}`);\n      }\n      output.push(`${COLOR.gray}─────────────────────${COLOR.reset}`);\n      output.push(`${COLOR.bold}${COLOR.white}💾 Values:${COLOR.reset}`);\n      args.forEach((arg, i) => {\n        let val;\n        if (arg === void 0) val = \"undefined\";\n        else if (arg === null) val = \"null\";\n        else if (typeof arg === \"object\") {\n          try {\n            val = JSON.stringify(arg, null, 2);\n          } catch {\n            val = \"[Circular or Complex Object]\";\n          }\n        } else if (typeof arg === \"function\") {\n          val = `[Function: ${arg.name || \"anonymous\"}]`;\n        } else {\n          val = String(arg);\n        }\n        output.push(`${COLOR.green}[${i}]:${COLOR.reset} ${val}`);\n      });\n      output.push(`${COLOR.yellow}━━━━━━━━━━━━━━━━━━━━━━${COLOR.reset}`);\n      console.log(output.join(\"\\n\"));\n    } catch (err) {\n      console.log(`${COLOR.red}[DEBUG ERROR]${COLOR.reset}`, err);\n      console.log(args);\n    }\n  }\n}\nconst debuggerInstance = new SourceMapDebugger();\nfunction debug(...args) {\n  debuggerInstance.debug(...args);\n}\nconst _TimerScheduler = class _TimerScheduler {\n  /** スケジューラにタスクを登録 */\n  static addTask(task) {\n    this.tasks.add(task);\n    this.ensureStarted();\n  }\n  /** タスクを削除 */\n  static removeTask(task) {\n    this.tasks.delete(task);\n  }\n  /** Interval を開始（1 本だけ） */\n  static ensureStarted() {\n    if (this.started) return;\n    this.started = true;\n    system.runInterval(() => {\n      this.tick++;\n      for (const task of this.tasks) {\n        try {\n          task();\n        } catch (e) {\n          console.error(\"[TimerScheduler] Task error:\", e);\n        }\n      }\n    }, 1);\n  }\n};\n_TimerScheduler.tasks = /* @__PURE__ */ new Set();\n_TimerScheduler.tick = 0;\n_TimerScheduler.started = false;\nlet TimerScheduler = _TimerScheduler;\nclass Timer {\n  constructor(onRun, onCancel) {\n    this.currentTick = 0;\n    this.stopped = false;\n    this.canceled = false;\n    this.forceCanceled = false;\n    this.onRun = onRun;\n    this.onCancel = onCancel;\n  }\n  /** 一時停止 */\n  stop() {\n    this.stopped = true;\n  }\n  /** 再開 */\n  resume() {\n    this.stopped = false;\n  }\n  /** 停止しているか */\n  isStopped() {\n    return this.stopped;\n  }\n  /** キャンセル要求 */\n  cancel(force = false) {\n    if (force) this.forceCanceled = true;\n    this.canceled = true;\n  }\n  /** タイマー内部キャンセル */\n  internalCancel(force = false) {\n    if (!this.task) return 2;\n    TimerScheduler.removeTask(this.task);\n    this.onCancel?.();\n    return force ? 1 : 0;\n  }\n}\nclass RepeatingTimer extends Timer {\n  constructor(onRun, opts = {}, onCancel) {\n    super(onRun, onCancel);\n    this.period = opts.period ?? 1;\n    this.endless = opts.endless ?? true;\n    this.silenceOnStop = opts.silenceOnStop ?? true;\n    this.maxElapsedTicks = opts.maxElapsedTicks;\n    this.onFinal = opts.onFinal;\n  }\n  /** タイマー開始 */\n  start() {\n    this.task = () => {\n      if (this.forceCanceled) return this.internalCancel(true);\n      if (this.canceled) return this.internalCancel();\n      if (!this.endless && this.maxElapsedTicks !== void 0 && this.currentTick >= this.maxElapsedTicks) {\n        this.onFinal?.();\n        return this.internalCancel();\n      }\n      if (this.currentTick % this.period === 0) {\n        if (!this.stopped || this.stopped && !this.silenceOnStop)\n          this.onRun?.(this.currentTick);\n      }\n      if (!this.stopped) this.currentTick++;\n    };\n    TimerScheduler.addTask(this.task);\n  }\n}\nclass DelayedTimer extends Timer {\n  constructor(onRun, opts = {}, onCancel) {\n    super(onRun, onCancel);\n    this.delay = opts.delay ?? 1;\n  }\n  start() {\n    this.task = () => {\n      if (this.forceCanceled) return this.internalCancel(true);\n      if (this.canceled) return this.internalCancel();\n      if (this.currentTick >= this.delay) {\n        this.onRun?.(this.currentTick);\n        return this.internalCancel();\n      }\n      this.currentTick++;\n    };\n    TimerScheduler.addTask(this.task);\n  }\n}\nfunction repeating(opts) {\n  const t = new RepeatingTimer(opts.run, opts, opts.cancel);\n  t.start();\n  return t;\n}\nfunction delayed(ticks, run, cancel) {\n  const t = new DelayedTimer(() => run(), { delay: ticks }, cancel);\n  t.start();\n  return t;\n}\nfunction sleep(tick) {\n  return new Promise((resolve) => {\n    new DelayedTimer(() => resolve(), { delay: tick }).start();\n  });\n}\nexport {\n  DelayedTimer,\n  EventManager,\n  Priority,\n  RepeatingTimer,\n  Vector3,\n  debug,\n  delayed,\n  keystone,\n  repeating,\n  sleep\n};\n","import { ButtonState, InputButton, ItemStack, ItemUseAfterEvent, Player, PlayerButtonInputAfterEvent, PlayerLeaveBeforeEvent, PlayerSwingStartAfterEvent, system, world } from '@minecraft/server';\nimport { getAllWeapon, getWeapon } from './weaponRegistry';\nimport { WeaponTicks } from './weapon';\nimport { delayed } from '@gollilla/keystone';\n\n/**\n * クールダウンが進んでいるかどうか\n * @param player \n * @param weaponItem \n * @returns {boolean}\n */\nfunction nowCooldown(player: Player, weaponItem: ItemStack): boolean {\n  const now = Date.now();\n  const until = player.getDynamicProperty(`weapon_cooldown:${weaponItem.typeId}`) ?? now;\n  return (now < Number(until));\n}\n\n/**\n * ウェポンの効果が継続中かどうか\n * @param player \n * @param weaponItem \n * @returns {boolean}\n */\nfunction nowActivated(player: Player, weaponItem: ItemStack): boolean {\n  return Boolean(player.getDynamicProperty(`weapon_activated:${weaponItem.typeId}`) ?? false);\n}\n\n/**\n * ウェポンの起動\n * @param player \n * @param weaponItem \n * @param weaponTicks\n */\nfunction activate(player: Player, weaponItem: ItemStack, weaponTicks: WeaponTicks) {\n  player.setDynamicProperty(`weapon_activated:${weaponItem.typeId}`, true);\n\n  delayed(weaponTicks.duration, () => {\n    const weapon = getWeapon(weaponItem.typeId);\n    if (weapon) weapon.onEnd?.(player);\n\n    const now = Date.now();\n    const millisecTick = weaponTicks.cooldown / 20 * 1000; \n    player.setDynamicProperty(`weapon_cooldown:${weaponItem.typeId}`, now + millisecTick);\n    player.startItemCooldown(weaponItem.typeId, weaponTicks.cooldown);\n\n    player.setDynamicProperty(`weapon_activated:${weaponItem.typeId}`);\n  });\n}\n\nworld.afterEvents.itemUse.subscribe((event: ItemUseAfterEvent) => {\n  const player = event.source;\n  const item = event.itemStack;\n  if (!item) return;\n  if (!item.typeId.startsWith('bmc:')) return;\n\n  const weapon = getWeapon(item.typeId);\n  if (!weapon) return;\n  if (nowCooldown(player, item)) return;\n  if (nowActivated(player, item)) return;\n  if (!player || !player.isValid) return;\n\n  const weaponTicks = weapon.onClick(player);\n  activate(player, item, weaponTicks);\n});\n\nworld.afterEvents.playerSwingStart.subscribe((event: PlayerSwingStartAfterEvent) => {\n  const player = event.player;\n  const item = event.heldItemStack;\n  if (!item) return;\n  if (!item.typeId.startsWith('bmc:')) return;\n\n  const weapon = getWeapon(item.typeId);\n  if (!weapon) return;\n  if (nowCooldown(player, item)) return;\n  if (!nowActivated(player, item)) return;\n  if (!player || !player.isValid) return;\n\n  weapon.onArmSwing?.(player);\n});\n\nworld.afterEvents.playerButtonInput.subscribe((event: PlayerButtonInputAfterEvent) => {\n  if (event.button != InputButton.Sneak) return;\n  if (event.newButtonState != ButtonState.Pressed) return;\n\n  const player = event.player;\n  const item = player.getComponent('minecraft:inventory')?.container.getItem(player.selectedSlotIndex);\n  if (!item) return;\n  if (!item.typeId.startsWith('bmc:')) return;\n\n  const weapon = getWeapon(item.typeId);\n  if (!weapon) return;\n  if (nowCooldown(player, item)) return;\n  if (!nowActivated(player, item)) return;\n  if (!player || !player.isValid) return;\n\n  weapon.onSneaking?.(player);\n});\n\nsystem.runInterval(() => {\n  for (const player of world.getPlayers()) {\n    const item = player.getComponent('minecraft:inventory')?.container.getItem(player.selectedSlotIndex);\n    if (!item || !item.typeId.startsWith('bmc:')) continue;\n    if (!player || !player.isValid) return;\n\n    const weapon = getWeapon(item.typeId);\n    weapon?.onTick?.(player);\n  }\n}, 1);\n\nworld.beforeEvents.playerLeave.subscribe((event: PlayerLeaveBeforeEvent) => {\n  const player = event.player;\n  for (const weapon of getAllWeapon().values()) {\n    player.setDynamicProperty(`weapon_cooldown:${weapon.typeId}`);\n    player.setDynamicProperty(`weapon_activated:${weapon.typeId}`);\n  }\n});\n","/* eslint-disable @typescript-eslint/no-unused-vars */\nimport { Player } from '@minecraft/server';\n\nexport type WeaponTicks = {\n  duration: number,\n  cooldown: number\n}\n\nexport abstract class Weapon {\n  abstract typeId: string;\n\n  onClick(player: Player): WeaponTicks {\n    return { duration: 0, cooldown: 0 };\n  }\n  onArmSwing?(player: Player) {}\n  onSneaking?(player: Player) {}\n  onTick?(player: Player) {}\n  onEnd?(player: Player) {}\n}\n","import { Player } from '@minecraft/server';\nimport { register } from '../weaponRegistry';\nimport { Weapon, WeaponTicks } from '../weapon';\nimport { delayed, Vector3 } from '@gollilla/keystone';\n\nclass Airride extends Weapon {\n  typeId = 'bmc:airride';\n\n  override onClick(player: Player): WeaponTicks {\n    const v = Vector3.fromBDS(player.getViewDirection()).normalize();\n    v.x *= 0.75;\n    v.z *= 0.75;\n    v.y = 0.995;\n    player.applyImpulse(v);\n\n    player.dimension.playSound('mob.ghast.charge', player.location);\n\n    return { duration: 5*20, cooldown: 18*20 };\n  }\n\n  override onSneaking(player: Player) {\n    const canFlap = player.getDynamicProperty(`weapon_data:${this.typeId}:flap`) ?? true;\n    if (!canFlap) return;\n\n    player.clearVelocity();\n    const v = Vector3.fromBDS(player.getViewDirection()).normalize();\n    v.x *= 1.2;\n    v.z *= 1.2;\n    v.y = 1;\n    player.applyImpulse(v);\n\n    player.dimension.playSound('mob.enderdragon.flap', player.location, { volume: 0.27, pitch: 1 });\n\n    const location = player.location;\n    location.y -= 1;\n    player.dimension.spawnParticle('minecraft:knockback_roar_particle', location);\n\n    player.addEffect('minecraft:slow_falling', 25, { amplifier: 1 });\n\n    player.setDynamicProperty(`weapon_data:${this.typeId}:flap`, false);\n\n    delayed(12, () => player.setDynamicProperty(`weapon_data:${this.typeId}:flap`));\n  }\n\n  override onEnd(player: Player): void {\n    player.dimension.playSound('mob.ghast.moan', player.location);\n  }\n}\n\nregister(new Airride());\n"],"mappings":"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","names":["_VLQDecoder","_TimerScheduler"]};
// ========== End of Embedded Source Map ==========

import { system, world, InputButton, ButtonState } from "@minecraft/server";
const registry = /* @__PURE__ */ new Map();
function register(item) {
  registry.set(item.typeId, item);
}
function getWeapon(typeId) {
  return registry.get(typeId);
}
function getAllWeapon() {
  return registry;
}
class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  /**
   * ゼロベクトルで生成
   * @return {Vector3}
   */
  static zero() {
    return new Vector3(0, 0, 0);
  }
  /**
   * {x, y, z} オブジェクトから生成
   * @param {_Vector3} pos 
   * @returns 
   */
  static fromBDS(pos) {
    return new Vector3(pos.x, pos.y, pos.z);
  }
  // ===== 基本ゲッター =====
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getZ() {
    return this.z;
  }
  getFloorX() {
    return Math.floor(this.x);
  }
  getFloorY() {
    return Math.floor(this.y);
  }
  getFloorZ() {
    return Math.floor(this.z);
  }
  /**
   * 加算
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @return {Vector3}
   */
  add(x, y, z) {
    return new Vector3(
      this.x + x,
      this.y + y,
      this.z + z
    );
  }
  /**
   * ベクトル単位での加算
   * @param {_Vector3} v 
   * @returns {Vector3}
   */
  addVector(v) {
    return this.add(v.x, v.y, v.z);
  }
  /**
   * 減算
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @return {Vector3}
   */
  subtract(x, y, z) {
    return this.add(-x, -y, -z);
  }
  /**
   * ベクトル単位での減算
   * @param {_Vector3} v
   * @return {Vector3}
   */
  subtractVector(v) {
    return this.add(-v.x, -v.y, -v.z);
  }
  /**
   * 乗算
   * @param {number} value
   * @return {Vector3}
   */
  multiply(value) {
    return new Vector3(
      this.x * value,
      this.y * value,
      this.z * value
    );
  }
  /**
   * 除算
   * @param {number} value
   * @return {Vector3}
   */
  divide(value) {
    return new Vector3(
      this.x / value,
      this.y / value,
      this.z / value
    );
  }
  /**
   * ベクトルの内部数値小数点切り上げ
   * @return {Vector3}
   */
  ceil() {
    return new Vector3(
      Math.ceil(this.x),
      Math.ceil(this.y),
      Math.ceil(this.z)
    );
  }
  /**
   * ベクトルの内部数値小数点切り捨て
   * @return {Vector3}
   */
  floor() {
    return new Vector3(
      Math.floor(this.x),
      Math.floor(this.y),
      Math.floor(this.z)
    );
  }
  /**
   * ベクトルの内部数値小数点四捨五入
   * @param {number} precision
   * @return {Vector3}
   */
  round(precision = 0) {
    const factor = Math.pow(10, precision);
    return new Vector3(
      Math.round(this.x * factor) / factor,
      Math.round(this.y * factor) / factor,
      Math.round(this.z * factor) / factor
    );
  }
  /**
   * ベクトルの内部数値の絶対値
   * @return {Vector3}
   */
  abs() {
    return new Vector3(
      Math.abs(this.x),
      Math.abs(this.y),
      Math.abs(this.z)
    );
  }
  /**
   * 指定した2点間のユークリッド距離
   * @param {_Vector3} pos 
   * @return {number}
   */
  distance(pos) {
    return Math.sqrt(this.distanceSquared(pos));
  }
  /**
   * 指定した2点間のユークリッド距離の2乗
   * @param {_Vector3} pos 
   * @return {number}
   */
  distanceSquared(pos) {
    const dx = this.x - pos.x;
    const dy = this.y - pos.y;
    const dz = this.z - pos.z;
    return dx * dx + dy * dy + dz * dz;
  }
  /**
   * 内積
   * @param {_Vector3} pos 
   * @return {number}
   */
  dot(pos) {
    return this.x * pos.x + this.y * pos.y + this.z * pos.z;
  }
  /**
   * 外積
   * @param {_Vector3} pos 
   * @return {Vector3}
   */
  cross(pos) {
    return new Vector3(
      this.y * pos.z - this.z * pos.y,
      this.z * pos.x - this.x * pos.z,
      this.x * pos.y - this.y * pos.x
    );
  }
  /**
   * ベクトルの比較
   * @param {_Vector3} pos 
   * @return {boolean}
   */
  equals(pos) {
    return this.x === pos.x && this.y === pos.y && this.z === pos.z;
  }
  /**
   * ベクトルの長さ
   * @return {number}
   */
  length() {
    return Math.sqrt(this.lengthSquared());
  }
  /**
   * ベクトルの長さの2乗
   * @return {number}
   */
  lengthSquared() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  /**
   * 正規化
   * @return {Vector3}
   */
  normalize() {
    const len = this.length();
    if (len > 0) {
      return this.divide(len);
    }
    return new Vector3(0, 0, 0);
  }
  /**
   * オブジェクトの数値指定再生成
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   * @return {Vector3}
   */
  withComponents(x, y, z) {
    return new Vector3(
      x !== void 0 ? x : this.x,
      y !== void 0 ? y : this.y,
      z !== void 0 ? z : this.z
    );
  }
  /**
   * BDS ScriptAPIで使える {x, y, z} 形式に変換
   * @returns {_Vector3}
   */
  toBDS() {
    return { x: this.x, y: this.y, z: this.z };
  }
  /** 通常のオブジェクトに変換 */
  toObject() {
    return { x: this.x, y: this.y, z: this.z };
  }
  toString() {
    return `_Vector3(x=${this.x}, y=${this.y}, z=${this.z})`;
  }
  /**
   * 最大点
   * @param {_Vector3} vector
   * @param {_Vector3[]} vectors 
   * @returns {Vector3}
   */
  static maxComponents(vector, ...vectors) {
    let x = vector.x;
    let y = vector.y;
    let z = vector.z;
    for (const pos of vectors) {
      x = Math.max(x, pos.x);
      y = Math.max(y, pos.y);
      z = Math.max(z, pos.z);
    }
    return new Vector3(x, y, z);
  }
  /**
   * 最小点
   * @param {_Vector3} vector
   * @param {_Vector3[]} vectors 
   * @returns {Vector3}
   */
  static minComponents(vector, ...vectors) {
    let x = vector.x;
    let y = vector.y;
    let z = vector.z;
    for (const pos of vectors) {
      x = Math.min(x, pos.x);
      y = Math.min(y, pos.y);
      z = Math.min(z, pos.z);
    }
    return new Vector3(x, y, z);
  }
  /**
   * 合計
   * @param {_Vector3[]} vectors
   * @returns {Vector3}
   */
  static sum(...vectors) {
    let x = 0, y = 0, z = 0;
    for (const v of vectors) {
      x += v.x;
      y += v.y;
      z += v.z;
    }
    return new Vector3(x, y, z);
  }
}
const COLOR = {
  reset: "\x1B[0m",
  bold: "\x1B[1m",
  dim: "\x1B[2m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  blue: "\x1B[34m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  white: "\x1B[37m",
  gray: "\x1B[90m"
};
const _VLQDecoder = class _VLQDecoder2 {
  static decode(str) {
    const result = [];
    let shift = 0;
    let value = 0;
    for (let i = 0; i < str.length; i++) {
      const digit = this.BASE64_CHARS.indexOf(str[i]);
      if (digit === -1) continue;
      const continuation = (digit & 32) !== 0;
      value += (digit & 31) << shift;
      if (continuation) {
        shift += 5;
      } else {
        const negative = (value & 1) !== 0;
        value >>>= 1;
        result.push(negative ? -value : value);
        value = 0;
        shift = 0;
      }
    }
    return result;
  }
};
_VLQDecoder.BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
let VLQDecoder = _VLQDecoder;
class SourceMapDebugger {
  constructor() {
    this.decodedMappings = [];
    this.initialized = false;
    this.initialize();
  }
  initialize() {
    if (typeof globalThis.__SOURCE_MAP__ !== "undefined") {
      this.sourceMap = globalThis.__SOURCE_MAP__;
      this.decodeMappings();
      this.initialized = true;
    }
  }
  decodeMappings() {
    if (!this.sourceMap?.mappings) return;
    const lines = this.sourceMap.mappings.split(";");
    let generatedLine = 1;
    let prevOriginalLine = 0;
    let prevOriginalColumn = 0;
    let prevSource = 0;
    let prevName = 0;
    for (const line of lines) {
      if (!line) {
        generatedLine++;
        continue;
      }
      const segments = line.split(",");
      let generatedColumn = 0;
      for (const segment of segments) {
        if (!segment) continue;
        const decoded = VLQDecoder.decode(segment);
        if (decoded.length < 1) continue;
        generatedColumn += decoded[0];
        const mapping = {
          generatedLine,
          generatedColumn,
          originalLine: 0,
          originalColumn: 0,
          sourceIndex: 0
        };
        if (decoded.length > 1) {
          prevSource += decoded[1];
          mapping.sourceIndex = prevSource;
          if (decoded.length > 2) {
            prevOriginalLine += decoded[2];
            mapping.originalLine = prevOriginalLine;
            if (decoded.length > 3) {
              prevOriginalColumn += decoded[3];
              mapping.originalColumn = prevOriginalColumn;
              if (decoded.length > 4) {
                prevName += decoded[4];
                mapping.name = this.sourceMap.names?.[prevName];
              }
            }
          }
        }
        this.decodedMappings.push(mapping);
      }
      generatedLine++;
    }
  }
  getOriginalPosition(line, column) {
    if (!this.initialized || this.decodedMappings.length === 0) return null;
    let best = null;
    let bestDistance = Infinity;
    for (const m of this.decodedMappings) {
      if (m.generatedLine === line) {
        const distance = column !== void 0 ? Math.abs(m.generatedColumn - column) : 0;
        if (distance < bestDistance) {
          bestDistance = distance;
          best = m;
        }
      } else if (m.generatedLine < line) {
        if (!best || m.generatedLine > best.generatedLine) best = m;
      }
    }
    if (best && this.sourceMap.sources?.[best.sourceIndex]) {
      return {
        source: this.sourceMap.sources[best.sourceIndex],
        line: best.originalLine,
        column: best.originalColumn,
        content: this.sourceMap.sourcesContent?.[best.sourceIndex],
        name: best.name
      };
    }
    return null;
  }
  debug(...args) {
    try {
      const err = new Error();
      const stack = err.stack || "";
      const stackLines = stack.split("\n");
      const output = [];
      output.push(`${COLOR.yellow}━━━━━━━━━━━━━━━━━━━━━━${COLOR.reset}`);
      output.push(`${COLOR.bold}${COLOR.cyan}📍 DEBUG${COLOR.reset}`);
      let position = null;
      for (let i = 2; i < Math.min(stackLines.length, 8); i++) {
        const line = stackLines[i];
        console.log(JSON.stringify(line));
        const match = /(?:\()?(?:[A-Za-z0-9._/-]+):(\d+)(?::(\d+))?\)?$/.exec(line);
        if (match) {
          const lineNum = parseInt(match[1]);
          const colNum = match[2] ? parseInt(match[2]) : void 0;
          position = this.getOriginalPosition(lineNum, colNum);
          if (position) break;
        }
      }
      if (position) {
        const file = position.source.replace(/^.*\//, "");
        output.push(`${COLOR.blue}📄 ${file}:${position.line}:${position.column}${COLOR.reset}`);
        if (position.name) output.push(`${COLOR.cyan}🏷 ${position.name}${COLOR.reset}`);
        if (position.content) {
          const lines = position.content.split("\n");
          const target = position.line - 1;
          const range = 2;
          output.push(`${COLOR.gray}─────────────────────${COLOR.reset}`);
          for (let i = Math.max(0, target - range); i <= Math.min(lines.length - 1, target + range); i++) {
            const num = `${(i + 1).toString().padStart(3, " ")}`;
            const content = lines[i];
            if (i === target) {
              output.push(`${COLOR.red}${COLOR.bold}→ ${num}: ${COLOR.white}${content}${COLOR.reset}`);
            } else {
              output.push(`${COLOR.gray}  ${num}: ${content}${COLOR.reset}`);
            }
          }
        }
      } else {
        output.push(`${COLOR.gray}📍 Location: (source map not available)${COLOR.reset}`);
      }
      output.push(`${COLOR.gray}─────────────────────${COLOR.reset}`);
      output.push(`${COLOR.bold}${COLOR.white}💾 Values:${COLOR.reset}`);
      args.forEach((arg, i) => {
        let val;
        if (arg === void 0) val = "undefined";
        else if (arg === null) val = "null";
        else if (typeof arg === "object") {
          try {
            val = JSON.stringify(arg, null, 2);
          } catch {
            val = "[Circular or Complex Object]";
          }
        } else if (typeof arg === "function") {
          val = `[Function: ${arg.name || "anonymous"}]`;
        } else {
          val = String(arg);
        }
        output.push(`${COLOR.green}[${i}]:${COLOR.reset} ${val}`);
      });
      output.push(`${COLOR.yellow}━━━━━━━━━━━━━━━━━━━━━━${COLOR.reset}`);
      console.log(output.join("\n"));
    } catch (err) {
      console.log(`${COLOR.red}[DEBUG ERROR]${COLOR.reset}`, err);
      console.log(args);
    }
  }
}
new SourceMapDebugger();
const _TimerScheduler = class _TimerScheduler2 {
  /** スケジューラにタスクを登録 */
  static addTask(task) {
    this.tasks.add(task);
    this.ensureStarted();
  }
  /** タスクを削除 */
  static removeTask(task) {
    this.tasks.delete(task);
  }
  /** Interval を開始（1 本だけ） */
  static ensureStarted() {
    if (this.started) return;
    this.started = true;
    system.runInterval(() => {
      this.tick++;
      for (const task of this.tasks) {
        try {
          task();
        } catch (e) {
          console.error("[TimerScheduler] Task error:", e);
        }
      }
    }, 1);
  }
};
_TimerScheduler.tasks = /* @__PURE__ */ new Set();
_TimerScheduler.tick = 0;
_TimerScheduler.started = false;
let TimerScheduler = _TimerScheduler;
class Timer {
  constructor(onRun, onCancel) {
    this.currentTick = 0;
    this.stopped = false;
    this.canceled = false;
    this.forceCanceled = false;
    this.onRun = onRun;
    this.onCancel = onCancel;
  }
  /** 一時停止 */
  stop() {
    this.stopped = true;
  }
  /** 再開 */
  resume() {
    this.stopped = false;
  }
  /** 停止しているか */
  isStopped() {
    return this.stopped;
  }
  /** キャンセル要求 */
  cancel(force = false) {
    if (force) this.forceCanceled = true;
    this.canceled = true;
  }
  /** タイマー内部キャンセル */
  internalCancel(force = false) {
    if (!this.task) return 2;
    TimerScheduler.removeTask(this.task);
    this.onCancel?.();
    return force ? 1 : 0;
  }
}
class DelayedTimer extends Timer {
  constructor(onRun, opts = {}, onCancel) {
    super(onRun, onCancel);
    this.delay = opts.delay ?? 1;
  }
  start() {
    this.task = () => {
      if (this.forceCanceled) return this.internalCancel(true);
      if (this.canceled) return this.internalCancel();
      if (this.currentTick >= this.delay) {
        this.onRun?.(this.currentTick);
        return this.internalCancel();
      }
      this.currentTick++;
    };
    TimerScheduler.addTask(this.task);
  }
}
function delayed(ticks, run, cancel) {
  const t = new DelayedTimer(() => run(), { delay: ticks }, cancel);
  t.start();
  return t;
}
function nowCooldown(player, weaponItem) {
  const now = Date.now();
  const until = player.getDynamicProperty(`weapon_cooldown:${weaponItem.typeId}`) ?? now;
  return now < Number(until);
}
function nowActivated(player, weaponItem) {
  return Boolean(player.getDynamicProperty(`weapon_activated:${weaponItem.typeId}`) ?? false);
}
function activate(player, weaponItem, weaponTicks) {
  player.setDynamicProperty(`weapon_activated:${weaponItem.typeId}`, true);
  delayed(weaponTicks.duration, () => {
    const weapon = getWeapon(weaponItem.typeId);
    if (weapon) weapon.onEnd?.(player);
    const now = Date.now();
    const millisecTick = weaponTicks.cooldown / 20 * 1e3;
    player.setDynamicProperty(`weapon_cooldown:${weaponItem.typeId}`, now + millisecTick);
    player.startItemCooldown(weaponItem.typeId, weaponTicks.cooldown);
    player.setDynamicProperty(`weapon_activated:${weaponItem.typeId}`);
  });
}
world.afterEvents.itemUse.subscribe((event) => {
  const player = event.source;
  const item = event.itemStack;
  if (!item) return;
  if (!item.typeId.startsWith("bmc:")) return;
  const weapon = getWeapon(item.typeId);
  if (!weapon) return;
  if (nowCooldown(player, item)) return;
  if (nowActivated(player, item)) return;
  if (!player || !player.isValid) return;
  const weaponTicks = weapon.onClick(player);
  activate(player, item, weaponTicks);
});
world.afterEvents.playerSwingStart.subscribe((event) => {
  const player = event.player;
  const item = event.heldItemStack;
  if (!item) return;
  if (!item.typeId.startsWith("bmc:")) return;
  const weapon = getWeapon(item.typeId);
  if (!weapon) return;
  if (nowCooldown(player, item)) return;
  if (!nowActivated(player, item)) return;
  if (!player || !player.isValid) return;
  weapon.onArmSwing?.(player);
});
world.afterEvents.playerButtonInput.subscribe((event) => {
  if (event.button != InputButton.Sneak) return;
  if (event.newButtonState != ButtonState.Pressed) return;
  const player = event.player;
  const item = player.getComponent("minecraft:inventory")?.container.getItem(player.selectedSlotIndex);
  if (!item) return;
  if (!item.typeId.startsWith("bmc:")) return;
  const weapon = getWeapon(item.typeId);
  if (!weapon) return;
  if (nowCooldown(player, item)) return;
  if (!nowActivated(player, item)) return;
  if (!player || !player.isValid) return;
  weapon.onSneaking?.(player);
});
system.runInterval(() => {
  for (const player of world.getPlayers()) {
    const item = player.getComponent("minecraft:inventory")?.container.getItem(player.selectedSlotIndex);
    if (!item || !item.typeId.startsWith("bmc:")) continue;
    if (!player || !player.isValid) return;
    const weapon = getWeapon(item.typeId);
    weapon?.onTick?.(player);
  }
}, 1);
world.beforeEvents.playerLeave.subscribe((event) => {
  const player = event.player;
  for (const weapon of getAllWeapon().values()) {
    player.setDynamicProperty(`weapon_cooldown:${weapon.typeId}`);
    player.setDynamicProperty(`weapon_activated:${weapon.typeId}`);
  }
});
class Weapon {
  onClick(player) {
    return { duration: 0, cooldown: 0 };
  }
  onArmSwing(player) {
  }
  onSneaking(player) {
  }
  onTick(player) {
  }
  onEnd(player) {
  }
}
class Airride extends Weapon {
  constructor() {
    super(...arguments);
    this.typeId = "bmc:airride";
  }
  onClick(player) {
    const v = Vector3.fromBDS(player.getViewDirection()).normalize();
    v.x *= 0.75;
    v.z *= 0.75;
    v.y = 0.995;
    player.applyImpulse(v);
    player.dimension.playSound("mob.ghast.charge", player.location);
    return { duration: 5 * 20, cooldown: 18 * 20 };
  }
  onSneaking(player) {
    const canFlap = player.getDynamicProperty(`weapon_data:${this.typeId}:flap`) ?? true;
    if (!canFlap) return;
    player.clearVelocity();
    const v = Vector3.fromBDS(player.getViewDirection()).normalize();
    v.x *= 1.2;
    v.z *= 1.2;
    v.y = 1;
    player.applyImpulse(v);
    player.dimension.playSound("mob.enderdragon.flap", player.location, { volume: 0.27, pitch: 1 });
    const location = player.location;
    location.y -= 1;
    player.dimension.spawnParticle("minecraft:knockback_roar_particle", location);
    player.addEffect("minecraft:slow_falling", 25, { amplifier: 1 });
    player.setDynamicProperty(`weapon_data:${this.typeId}:flap`, false);
    delayed(12, () => player.setDynamicProperty(`weapon_data:${this.typeId}:flap`));
  }
  onEnd(player) {
    player.dimension.playSound("mob.ghast.moan", player.location);
  }
}
register(new Airride());

