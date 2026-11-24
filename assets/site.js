/* Portfolio homepage: data + rendering. Every number here comes from the resume. */
(function () {
  'use strict';

  var lang = 'en';
  try { lang = localStorage.getItem('lang') || 'en'; } catch (e) {}

  function T(v) { return v && typeof v === 'object' && !Array.isArray(v) ? (v[lang] != null ? v[lang] : v.en) : v; }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }

  /* ---------------- static strings ---------------- */
  var I18N = {
    'nav.work': { en: 'Work', zh: '经历' },
    'nav.projects': { en: 'Projects', zh: '项目' },
    'nav.dark': { en: 'Dark', zh: '深色' },
    'nav.light': { en: 'Light', zh: '浅色' },
    'hero.role': { en: 'Backend and AI-agent engineer · Hong Kong', zh: '后端与 AI Agent 工程师 · 香港' },
    'hero.p1': {
      en: 'I finished an MSc in Computer Science at the University of Hong Kong in 2026. Most recently I built the Go platform behind Matchii, a services marketplace, where the hard part was making payments and long-running agent jobs safe to retry.',
      zh: '我 2026 年在香港大学读完计算机科学硕士。最近一份工作是在 Matchii 搭建 Go 后端平台（一个服务交易平台），最难的部分是让支付和长时间运行的 Agent 任务在重试时依然安全。'
    },
    'hero.p2': {
      en: 'I also work on a WhatsApp assistant for a clinical exercise programme, and I spent my MSc reproducing and post-training a vision-language-action model on four GPUs. Before that I ran research workloads on the Zhengzhou supercomputing cluster.',
      zh: '我还在做一个临床运动项目的 WhatsApp 助手；硕士期间在四张 GPU 上复现并后训练了一个视觉-语言-动作模型。再往前，我在郑州超算中心为科研用户运维计算任务。'
    },
    'hero.resume': { en: 'Resume', zh: '简历' },
    'sec.work': { en: 'Work', zh: '经历' },
    'sec.projects': { en: 'Projects', zh: '项目' },
    'sec.skills': { en: 'Tools I use', zh: '常用技术' },
    'sec.more': { en: 'Elsewhere', zh: '其他' },
    'more.profile': { en: 'Long-form notes on each project', zh: '每个项目的详细笔记（英文）' },
    'm.problem': { en: 'Problem', zh: '问题' },
    'm.built': { en: 'What I built', zh: '我做了什么' },
    'm.result': { en: 'Result', zh: '结果' },
    'm.close': { en: 'Close', zh: '关闭' },
    'm.more': { en: 'Details', zh: '详情' },
    'viz.click': { en: 'Select a component to read what it does.', zh: '点选组件查看说明。' },
    'play': { en: 'Load the game (it runs in this page)', zh: '加载游戏（在本页运行）' }
  };

  var WORK = [
    {
      role: { en: 'Full-Stack / AI Platform Engineer', zh: '全栈 / AI 平台工程师' }, org: { en: 'Matchii · AI-native services marketplace', zh: 'Matchii · AI 驱动的服务交易平台' }, when: { en: 'Jul – Aug 2026', zh: '2026.07 – 2026.08' }, open: 'matchii',
      hook: { en: 'Go modular monolith + Next.js; ledgers, idempotency and a durable agent runtime.', zh: 'Go 模块化单体 + Next.js；账本、幂等与可恢复的 Agent 运行时。' },
      pts: {
        en: ['115-table PostgreSQL schema over 89 migrations, 185 FKs, 68 partial indexes; append-only ledgers, idempotency keys, row locks and SQL CAS.', 'Redis cache on a hot endpoint: 6.1k → 8.6k req/s (+42%), p95 11.1 → 7.2 ms in a reproducible A/B test.', 'Six-state agent runtime and fleet-safe DAG engine with leases and heartbeats; 24-capability connector boundary gates every write.', 'CI with 1,599 Go tests, 25 front-end contract checks, race detection and 8,192 permission combinations.'],
        zh: ['115 张表的 PostgreSQL 模型，89 次迁移、185 个外键、68 个部分索引；只追加账本、幂等键、行锁与 SQL 条件更新。', '热点接口加 Redis 缓存：可复现 A/B 测试中吞吐 6.1k → 8.6k req/s（+42%），p95 11.1 → 7.2 ms。', '六状态 Agent 运行时与多实例安全的 DAG 引擎（租约 + 心跳）；24 项能力的连接器边界把关所有写操作。', 'CI 覆盖 1,599 个 Go 测试、25 项前端契约检查、竞态检测与 8,192 种权限组合。']
      }
    },
    {
      role: { en: 'AI Engineer', zh: 'AI 工程师' }, org: { en: 'M-PAC WhatsApp Programme · Healthcare AI', zh: 'M-PAC WhatsApp 项目 · 医疗 AI' }, when: { en: 'Jan 2026 – present', zh: '2026.01 – 至今' }, open: 'mpac',
      hook: { en: 'Production RAG for a 12-week clinical programme in Cantonese and Traditional Chinese.', zh: '面向 12 周临床项目的生产级 RAG，粤语与繁体中文。' },
      pts: {
        en: ['Hybrid retrieval, mandatory [S1] citations, dialogue-state routing and a pre-send faithfulness check; sensitive topics go to physicians.', 'Six backend modules; ~720 outbound / ~360 inbound messages a day, 3,000–5,000 LLM calls a week, React admin console.'],
        zh: ['混合检索、强制 [S1] 引用、对话状态路由与发送前忠实度校验；敏感话题转交医师。', '六个后端模块；日均约 720 条发出 / 360 条接收消息，每周 3,000–5,000 次 LLM 调用，配 React 管理台。']
      }
    },
    {
      role: { en: 'Open-Source Contributor', zh: '开源贡献者' }, org: 'Vibe-Trading (HKUDS)', when: { en: 'Jan 2026 – present', zh: '2026.01 – 至今' }, open: 'vibe',
      hook: { en: 'Merged reliability fixes to a finance research agent with swarm teams.', zh: '为带 swarm 团队的金融研究 Agent 贡献已合并的可靠性修复。' },
      pts: {
        en: ['Fixes covering strict run-card JSON, search-connector retries, yfinance end-date handling and timeout configuration.'],
        zh: ['修复涵盖严格的 run card JSON、搜索连接器重试、yfinance 截止日期处理与超时配置。']
      }
    },
    {
      role: { en: 'MSc Research Engineer', zh: '硕士研究工程师' }, org: { en: 'Being-H0.5 VLA · HKU, Prof. Taku Komura', zh: 'Being-H0.5 VLA · 香港大学，Taku Komura 教授' }, when: { en: 'Sep 2025 – Jun 2026', zh: '2025.09 – 2026.06' }, open: 'being',
      hook: { en: 'Multi-GPU training, evaluation pipeline and a Blackwell port.', zh: '多卡训练、评测流水线与 Blackwell 移植。' },
      pts: {
        en: ['ZeroMQ inference server + headless MuJoCo/EGL harness; reproduced the official 2B checkpoint at 95–98.6% over 2,000 LIBERO episodes.', '4-GPU FSDP training of InternVL3.5-4B + Qwen3-4B, ported to sm_120 / CUDA 12.8 (~0.3 steps/s, ~92 GB/card).'],
        zh: ['ZeroMQ 推理服务 + 无界面 MuJoCo/EGL 评测框架；在 2,000 个 LIBERO 回合上复现官方 2B 检查点，达到 95–98.6%。', '4 卡 FSDP 训练 InternVL3.5-4B + Qwen3-4B，移植到 sm_120 / CUDA 12.8（约 0.3 步/秒，单卡约 92 GB）。']
      }
    },
    {
      role: { en: 'Research Assistant', zh: '研究助理' }, org: { en: 'National Supercomputing Center in Zhengzhou · Prof. Bo Ji', zh: '国家超级计算郑州中心 · 姬波教授' }, when: { en: 'Sep 2023 – Jun 2025', zh: '2023.09 – 2025.06' }, open: 'nl2bp',
      hook: { en: 'Shared GPU/CPU cluster operations and the NL2BP multi-agent pipeline.', zh: '共享 GPU/CPU 集群运维与 NL2BP 多 Agent 流水线。' },
      pts: {
        en: ['Maintained Slurm jobs, module/conda environments and cluster workflows for research users.', 'Built NL2BP, a CrewAI pipeline of 7 roles / 9 agents producing validated PlantUML blueprints.'],
        zh: ['为科研用户维护 Slurm 作业、module/conda 环境与集群工作流。', '构建 NL2BP：7 个角色 / 9 个 Agent 的 CrewAI 流水线，输出经过校验的 PlantUML 蓝图。']
      }
    }
  ];

  var CATS = [
    { id: 'all', l: { en: 'All', zh: '全部' } },
    { id: 'backend', l: { en: 'Backend', zh: '后端' } },
    { id: 'agents', l: { en: 'Agents & RAG', zh: 'Agent 与 RAG' } },
    { id: 'ml', l: { en: 'ML research', zh: '机器学习研究' } },
    { id: 'fun', l: { en: 'Games & tools', zh: '游戏与工具' } }
  ];

  var P = [
    {
      id: 'matchii', cover: 'assets/covers/matchii.svg', cats: ['backend', 'agents'], kind: { en: 'Industry · 2026', zh: '工作 · 2026' },
      title: { en: 'Matchii platform', zh: 'Matchii 平台' },
      line: { en: 'Go + Next.js marketplace with ledgers, idempotency and a durable agent runtime.', zh: 'Go + Next.js 服务交易平台：账本、幂等与可恢复 Agent 运行时。' },
      metric: { en: '+42% throughput · p95 −35%', zh: '吞吐 +42% · p95 −35%' },
      sum: { en: 'An AI-native services marketplace. I designed the platform as a Go modular monolith with a Next.js front end, keeping deterministic domain kernels apart from orchestration and I/O.', zh: '一个 AI 驱动的服务交易平台。我把平台设计为 Go 模块化单体 + Next.js 前端，把确定性业务内核与编排、I/O 分开。' },
      problem: { en: 'Payments and workflow steps must never run twice, even with retries, multiple instances and restarts.', zh: '在重试、多实例和重启下，支付与流程步骤都绝不能执行两次。' },
      built: { en: 'Ledger-based schema with idempotency keys and SQL CAS; a lease-based agent runtime; a connector boundary for credentials; CI with real Postgres/Redis.', zh: '基于账本与幂等键、SQL 条件更新的数据模型；基于租约的 Agent 运行时；隔离凭证的连接器边界；接真实 Postgres/Redis 的 CI。' },
      result: { en: '6.1k → 8.6k req/s on a hot endpoint; 922 req/s at 64 ms p95 over 100k rows; 1,599 Go tests gate every release.', zh: '热点接口 6.1k → 8.6k req/s；10 万行分页 922 req/s、p95 64 ms；每次发布由 1,599 个 Go 测试把关。' },
      viz: {
        type: 'arch', layers: [
          { name: { en: 'Client', zh: '客户端' }, nodes: [['Next.js', { en: 'Next.js front end; 25 contract checks in CI keep it in sync with the Go API.', zh: 'Next.js 前端；CI 中 25 项契约检查保证与 Go API 一致。' }]] },
          { name: { en: 'Service', zh: '服务' }, nodes: [['Go API', { en: 'Modular monolith: one deployable, strict module boundaries, deterministic kernels separated from I/O.', zh: '模块化单体：单一部署单元、严格模块边界，确定性内核与 I/O 分离。' }], ['Agent runtime', { en: 'Six-state runtime and fleet-safe DAG engine: validated tools, durable approvals, SQL CAS, leases and heartbeats. A 30 s sweep recovers up to 200 open runs per tick.', zh: '六状态运行时与多实例安全 DAG 引擎：工具校验、持久化审批、SQL 条件更新、租约与心跳；每 30 秒扫描最多收回 200 条未完成任务。' }], ['Connectors', { en: '24-capability boundary: agent code never sees credentials, and every write goes through it.', zh: '24 项能力的边界：Agent 代码接触不到凭证，所有写操作都经过它。' }], ['Stripe', { en: 'Payments recorded through append-only ledgers with idempotency keys, so a retried webhook cannot double-charge.', zh: '支付经只追加账本与幂等键记录，重试的 webhook 不会重复扣款。' }]] },
          { name: { en: 'Data', zh: '数据' }, nodes: [['PostgreSQL', { en: '115 tables, 89 migrations, 185 FKs, 68 partial indexes. Indexed pagination over 100k rows: 922 req/s at 64 ms p95. If Postgres is lost, traffic drains.', zh: '115 张表、89 次迁移、185 个外键、68 个部分索引；10 万行索引分页 922 req/s、p95 64 ms。Postgres 故障时自动切断流量。' }], ['Redis', { en: '60 s cache on a hot endpoint: +42% throughput, −35% p95. If Redis is lost, the app degrades visibly and core jobs keep running.', zh: '热点接口 60 秒缓存：吞吐 +42%、p95 −35%。Redis 故障时明确降级，核心任务照常运行。' }]] },
          { name: { en: 'Ops', zh: '运维' }, nodes: [['CI', { en: '1,599 Go tests with real Postgres/Redis, race detection, vulnerability scanning, 8,192 permission combinations.', zh: '1,599 个 Go 测试，接真实 Postgres/Redis，含竞态检测、漏洞扫描与 8,192 种权限组合。' }], ['Prometheus / Grafana', { en: 'Metrics and dashboards; deployed on GCP Cloud Run.', zh: '指标与看板；部署在 GCP Cloud Run。' }]] }
        ],
        bars: [{ t: { en: 'Hot endpoint throughput (req/s)', zh: '热点接口吞吐（req/s）' }, max: 9000, rows: [[{ en: 'Before', zh: '优化前' }, 6100, '6.1k'], [{ en: 'With Redis', zh: '加 Redis 后' }, 8600, '8.6k', 1]] }, { t: { en: 'p95 latency (ms, lower is better)', zh: 'p95 延迟（ms，越低越好）' }, max: 12, rows: [[{ en: 'Before', zh: '优化前' }, 11.1, '11.1'], [{ en: 'With Redis', zh: '加 Redis 后' }, 7.2, '7.2', 1]] }]
      },
      tags: ['Go', 'Next.js', 'PostgreSQL', 'Redis', 'Stripe', 'Prometheus', 'Grafana', 'GCP Cloud Run'],
      links: []
    },
    {
      id: 'mpac', cover: 'assets/covers/mpac.svg', cats: ['agents', 'backend'], kind: { en: 'Industry · Healthcare AI', zh: '工作 · 医疗 AI' },
      title: { en: 'M-PAC WhatsApp RAG', zh: 'M-PAC WhatsApp RAG' },
      line: { en: 'Grounded clinical assistant for 500 cancer survivors, in Cantonese and Traditional Chinese.', zh: '面向 500 名癌症康复者的有出处临床助手，粤语与繁体中文。' },
      metric: { en: '~720 msgs/day · citations required', zh: '日均约 720 条消息 · 强制引用' },
      sum: { en: 'A WhatsApp assistant for a 12-week exercise programme. In a clinical setting a confident wrong answer is worse than no answer, so every reply must be grounded and checked before it is sent.', zh: '12 周运动项目的 WhatsApp 助手。在临床场景里，自信的错误回答比不回答更糟，所以每条回复都必须有出处并在发送前经过校验。' },
      problem: { en: 'Reduce hallucination risk for patients while handling predictable bilingual message volume.', zh: '在稳定处理双语消息量的同时，降低对患者的幻觉风险。' },
      built: { en: 'Hybrid retrieval, mandatory [S1] citations, dialogue-state routing, a faithfulness validator and safety guardrails, split into six backend modules.', zh: '混合检索、强制 [S1] 引用、对话状态路由、忠实度校验与安全护栏，拆为六个后端模块。' },
      result: { en: '~720 outbound / ~360 inbound messages a day and 3,000–5,000 LLM calls a week; sensitive topics always reach a physician.', zh: '日均约 720 条发出 / 360 条接收消息，每周 3,000–5,000 次 LLM 调用；敏感话题一律转给医师。' },
      viz: {
        type: 'flow', steps: [
          ['WhatsApp', { en: 'Participants message in Cantonese or Traditional Chinese; the scheduler also sends the 12-week curriculum.', zh: '参与者用粤语或繁体中文发消息；调度器同时按 12 周课程主动推送。' }],
          [{ en: 'Dialogue state', zh: '对话状态' }, { en: 'Routes by where the participant is in the conversation and programme, not just by the last message.', zh: '根据参与者在对话和项目中的阶段路由，而不只看最后一条消息。' }],
          [{ en: 'Hybrid retrieval', zh: '混合检索' }, { en: 'Keyword + vector search over the programme materials in Chroma.', zh: '在 Chroma 中对项目资料做关键词 + 向量检索。' }],
          ['GPT-4o', { en: 'Generates the reply; every claim must carry an [S1]-style citation to a retrieved source.', zh: '生成回复；每个论断都必须带 [S1] 式引用，指向检索到的资料。' }],
          [{ en: 'Faithfulness check', zh: '忠实度校验' }, { en: 'Before sending, the reply is validated against its sources; unsupported answers are not sent.', zh: '发送前对照来源校验回复；没有依据的回答不会发出。' }],
          [{ en: 'Guardrails', zh: '安全护栏' }, { en: 'Sensitive topics are never answered by the AI and are escalated to physicians.', zh: '敏感话题不由 AI 回答，直接转交医师。' }],
          [{ en: 'Admin console', zh: '管理台' }, { en: 'React console for monitoring conversations and managing enrolment; deployed on DigitalOcean/AWS.', zh: 'React 管理台，用于监控对话与管理入组；部署在 DigitalOcean/AWS。' }]
        ]
      },
      tags: ['RAG', 'Node.js', 'TypeScript', 'Chroma', 'GPT-4o', 'WhatsApp', 'React'],
      links: []
    },
    {
      id: 'kith', cats: ['agents'], kind: { en: 'Personal · 2025 – now', zh: '个人项目 · 2025 – 至今' },
      title: { en: 'KithAgent', zh: 'KithAgent' },
      line: { en: 'Self-hosted agent gateway with memory built from your own files.', zh: '自托管 Agent 网关，记忆来自你自己的文件。' },
      metric: { en: 'Recall ~40% → ~78%', zh: '召回率约 40% → 约 78%' },
      img: 'assets/img/kith-overview.png',
      sum: { en: 'Coding agents forget who you are between sessions, while the context that describes you lives in files on your machine. KithAgent turns those files into memory agents can use.', zh: '编程 Agent 每次会话都会忘记你是谁，而描述你的上下文其实就在本机文件里。KithAgent 把这些文件变成 Agent 可用的记忆。' },
      problem: { en: 'Mixed file types and session-only memory; keyword search misses relevant context.', zh: '文件类型混杂、记忆只在会话内有效；关键词检索找不到相关上下文。' },
      built: { en: 'Karpathy-style LLM Wiki over immutable sources; rebuildable FTS5 / vector / graph indexes; fusion + cross-encoder rerank + second-pass retrieval.', zh: '基于不可改原始文件的 Karpathy 式 LLM Wiki；可重建的 FTS5 / 向量 / 图索引；融合检索 + cross-encoder 重排 + 二次检索。' },
      result: { en: 'Recall ~40% → ~78% (+38 pp); >90% non-text triage accuracy; tracked across 19 pytest suites.', zh: '召回率约 40% → 约 78%（+38 个百分点）；非文本识别准确率 >90%；由 19 个 pytest 套件跟踪。' },
      viz: {
        type: 'gallery', shots: [
          ['assets/img/kith-overview.png', { en: 'Dashboard overview: indexed files, summaries, priority distribution', zh: '总览：索引文件、摘要进度、优先级分布' }],
          ['assets/img/kith-rag.png', { en: 'RAG control panel', zh: 'RAG 控制面板' }],
          ['assets/img/kith-triage.png', { en: 'LLM triage of files by priority', zh: 'LLM 按优先级分诊文件' }],
          ['assets/img/kith-knowledge-base.png', { en: 'Knowledge base entries', zh: '知识库条目' }]
        ],
        bars: [{ t: { en: 'Retrieval recall', zh: '检索召回率' }, max: 100, rows: [[{ en: 'Keyword only', zh: '仅关键词' }, 40, '~40%'], [{ en: 'Fusion + rerank', zh: '融合 + 重排' }, 78, '~78%', 1]] }]
      },
      tags: ['Python', 'SQLite FTS5', 'Vector + graph', 'Cross-encoder', 'Docker', 'vLLM', 'LiteLLM', 'Hermes Agent', 'Pi Agent'],
      links: [['GitHub', 'https://github.com/MarkfuGod/KithAgent']]
    },
    {
      id: 'being', cover: 'assets/covers/being.svg', cats: ['ml'], kind: { en: 'MSc research · HKU', zh: '硕士研究 · 港大' },
      title: { en: 'Being-H0.5 VLA', zh: 'Being-H0.5 VLA' },
      line: { en: 'Reproducing a robot policy model, then testing what pre-training buys.', zh: '复现前沿机器人策略模型，并检验预训练到底带来了什么。' },
      metric: { en: '95–98.6% reproduced on LIBERO', zh: 'LIBERO 复现 95–98.6%' },
      sum: { en: 'I brought the released vision-language-action model up from a fresh clone, reproduced its results, recreated post-training from base weights, and ported the stack to NVIDIA Blackwell.', zh: '我从零拉起开源的视觉-语言-动作模型，复现其结果，从基座权重复刻后训练，并把整套训练栈移植到 NVIDIA Blackwell。' },
      problem: { en: 'Can a bigger backbone with post-training alone replace human-centric pre-training?', zh: '更大的骨干加上后训练，能否替代以人为中心的预训练？' },
      built: { en: 'ZeroMQ inference server, headless MuJoCo/EGL evaluation, 4-GPU FSDP training of InternVL3.5-4B + Qwen3-4B, a port to sm_120 / CUDA 12.8.', zh: 'ZeroMQ 推理服务、无界面 MuJoCo/EGL 评测、InternVL3.5-4B + Qwen3-4B 的 4 卡 FSDP 训练、移植到 sm_120 / CUDA 12.8。' },
      result: { en: 'The from-base 4B reached 37.8% vs 95–98.6% for the pre-trained 2B: doubling parameters did not close the gap.', zh: '从基座训起的 4B 只有 37.8%，预训练 2B 为 95–98.6%：参数翻倍并没有弥补差距。' },
      viz: {
        type: 'bars', bars: [
          { t: { en: 'Official 2B checkpoint, reproduced (success rate)', zh: '官方 2B 检查点复现（成功率）' }, max: 100, rows: [['LIBERO-Spatial', 98.6, '98.6%', 1], ['LIBERO-Object', 97.0, '97.0%', 1], ['LIBERO-Goal', 98.0, '98.0%', 1], ['LIBERO-10', 95.0, '95.0%', 1]] },
          { t: { en: 'Does post-training replace pre-training? (LIBERO-Spatial)', zh: '后训练能否替代预训练？（LIBERO-Spatial）' }, max: 100, rows: [[{ en: 'Pre-trained 2B', zh: '预训练 2B' }, 98.6, '98.6%', 1], [{ en: '4B from base, 6k steps', zh: '4B 从基座，6k 步' }, 37.8, '37.8%']] }
        ]
      },
      tags: ['PyTorch', 'FSDP', 'Flow matching', 'LIBERO', 'MuJoCo / EGL', 'ZeroMQ', 'CUDA 12.8'],
      links: [[{ en: 'Full write-up', zh: '完整长文' }, 'profile.html']]
    },
    {
      id: 'skillios', cover: 'assets/covers/skillios.svg', cats: ['agents', 'backend'], kind: { en: 'Team lead · TestFlight', zh: '组长 · TestFlight' },
      title: { en: 'Skillios (ItsMyGoal)', zh: 'Skillios（ItsMyGoal）' },
      line: { en: 'Natural-language goals → runnable agent tasks, on iOS with a FastAPI backend.', zh: '自然语言目标 → 可运行的 Agent 任务；iOS 客户端 + FastAPI 后端。' },
      metric: { en: 'Latency ~8.2 s → ~3.4 s', zh: '延迟约 8.2 秒 → 约 3.4 秒' },
      sum: { en: 'A gamified goal planner: an agent decomposes a goal into a skill tree of quests, and a chat agent plans real-world activities. AI-created tasks always need user confirmation before they touch the database.', zh: '游戏化目标规划应用：Agent 把目标拆成技能树任务，聊天 Agent 规划现实活动。AI 创建的任务写入数据库前一律需要用户确认。' },
      problem: { en: 'Multi-tool agent runs were slow, but parallel writes would conflict.', zh: '多工具 Agent 调用太慢，但并行写入会冲突。' },
      built: { en: 'iOS client, FastAPI/PostgreSQL backend on AWS (CDK, ECS Fargate, RDS); ~10 function-calling tools; read-only tools in parallel, writes serialized.', zh: 'iOS 客户端、AWS 上的 FastAPI/PostgreSQL 后端（CDK、ECS Fargate、RDS）；约 10 个函数调用工具；只读工具并行、写操作串行。' },
      result: { en: 'Multi-tool latency ~8.2 s → ~3.4 s (~2.4×); shipped through TestFlight with JWT auth and per-user LLM quotas.', zh: '多工具延迟约 8.2 秒 → 约 3.4 秒（约 2.4×）；配 JWT 认证与用户级 LLM 配额，经 TestFlight 发布。' },
      viz: { type: 'bars', bars: [{ t: { en: 'Multi-tool itinerary latency (s, lower is better)', zh: '多工具行程规划延迟（秒，越低越好）' }, max: 9, rows: [[{ en: 'Sequential tools', zh: '串行调用' }, 8.2, '~8.2 s'], [{ en: 'Parallel reads', zh: '只读并行' }, 3.4, '~3.4 s', 1]] }] },
      tags: ['SwiftUI', 'SwiftData', 'FastAPI', 'PostgreSQL', 'AWS CDK', 'ECS Fargate', 'Function calling'],
      links: [['GitHub', 'https://github.com/MarkfuGod/skillios'], ['TestFlight', 'https://testflight.apple.com/join/FVfXajpn']]
    },
    {
      id: 'vibe', cover: 'assets/covers/vibe.svg', cats: ['agents'], kind: { en: 'Open source · HKUDS', zh: '开源 · HKUDS' },
      title: { en: 'Vibe-Trading', zh: 'Vibe-Trading' },
      line: { en: 'Finance research agent with swarm teams. I contributed merged reliability fixes.', zh: '带 swarm 团队的金融研究 Agent，我贡献了已合并的可靠性修复。' },
      metric: { en: 'Merged PRs upstream', zh: '上游已合并 PR' },
      sum: { en: 'Vibe-Trading turns plain-language market questions into reproducible research: routed skills, live data, backtests and run cards with evidence and caveats. Preset swarm teams debate and synthesize one report.', zh: 'Vibe-Trading 把自然语言市场问题变成可复现的研究：技能路由、实时数据、回测，以及带证据与风险提示的 run card。预设 swarm 团队讨论后汇总成一份报告。' },
      problem: { en: 'Swarm runs and external data sources failed in ways that broke reports.', zh: 'swarm 运行与外部数据源的异常会导致报告出错。' },
      built: { en: 'Fixes for strict run-card JSON, search-connector retries, yfinance end-date handling and timeout configuration.', zh: '修复严格的 run card JSON、搜索连接器重试、yfinance 截止日期处理与超时配置。' },
      result: { en: 'Merged into the HKUDS repository.', zh: '已合并进 HKUDS 仓库。' },
      viz: null,
      tags: ['Python', 'Multi-agent', 'Backtesting', 'Open source'],
      links: [['HKUDS/Vibe-Trading', 'https://github.com/HKUDS/Vibe-Trading'], ['PR #296', 'https://github.com/HKUDS/Vibe-Trading/pull/296'], [{ en: 'Project notes', zh: '项目说明' }, 'Vibe-Trading-Project-Highlight_en.html']]
    },
    {
      id: 'nl2bp', cover: 'assets/covers/nl2bp.svg', cats: ['agents', 'ml'], kind: { en: 'BEng thesis · ZZU', zh: '本科毕设 · 郑大' },
      title: { en: 'NL2BP', zh: 'NL2BP' },
      line: { en: 'Natural-language requirements → validated PlantUML blueprints, by 9 agents.', zh: '自然语言需求 → 经过校验的 PlantUML 蓝图，由 9 个 Agent 协作完成。' },
      metric: { en: '7 roles / 9 agents', zh: '7 个角色 / 9 个 Agent' },
      sum: { en: 'A CrewAI pipeline that turns ambiguous requirements into reviewable architecture: each role owns one part of the design and the output is validated PlantUML.', zh: '把模糊需求转成可评审架构的 CrewAI 流水线：每个角色负责设计的一部分，最终输出经过校验的 PlantUML。' },
      problem: { en: 'Requirements written in prose are hard to review as architecture.', zh: '文字需求很难直接当作架构来评审。' },
      built: { en: 'Single-agent role-switching and multi-agent collaboration workflows with prompt templates; 7 roles / 9 agents.', zh: '单 Agent 角色切换与多 Agent 协作两套工作流及提示模板；7 个角色 / 9 个 Agent。' },
      result: { en: 'Validated PlantUML blueprints from natural-language input.', zh: '从自然语言输入生成经过校验的 PlantUML 蓝图。' },
      viz: { type: 'svg', src: 'system_architecture_layers.svg' },
      tags: ['CrewAI', 'Python', 'PlantUML', 'Multi-agent'],
      links: [['GitHub', 'https://github.com/MarkfuGod/NL2BP-Natural-Language-to-UML-Blueprints'], [{ en: 'Project notes', zh: '项目说明' }, 'NL2BP-Project-Highlight_en.html']]
    },
    {
      id: 'atari', cover: 'assets/covers/atari.svg', cats: ['fun'], kind: { en: 'Personal · 2025', zh: '个人项目 · 2025' },
      title: { en: 'Atari Portal', zh: 'Atari Portal' },
      line: { en: 'Nine arcade games linked by portals. Every sprite and sound generated at runtime.', zh: '九款街机游戏由传送门串联，所有画面与音效都在运行时生成。' },
      metric: { en: 'Playable on this page', zh: '可在本页直接游玩' },
      sum: { en: 'Pac-Man, Breakout, Space Invaders, Frogger, Asteroids, Tetris and three originals, connected by portals that open when you meet each game\'s trigger. No image or audio files ship with the build.', zh: '吃豆人、打砖块、太空侵略者、青蛙过河、小行星、俄罗斯方块和三款原创游戏，满足各自条件即可打开传送门进入下一款。构建产物里没有任何图片或音频文件。' },
      problem: { en: 'Make one coherent game out of nine different mechanics.', zh: '把九种不同玩法做成一个连贯的游戏。' },
      built: { en: 'Phaser 3 gameplay, a Three.js overlay for portal and glitch effects, Canvas-drawn textures and Web Audio synthesis; GitHub Actions deploy and an Electron build.', zh: 'Phaser 3 实现玩法，Three.js 叠加层做传送门与故障特效，纹理用 Canvas 绘制、音效用 Web Audio 合成；GitHub Actions 部署，另有 Electron 桌面版。' },
      result: { en: 'Story, arcade and free-play modes with a coin shop and a difficulty curve. You can play it below.', zh: '剧情、街机、自由三种模式，带金币商店与难度曲线，下面可以直接玩。' },
      viz: { type: 'embed', src: 'https://markfugod.github.io/atari-portal/' },
      tags: ['Phaser 3', 'Three.js', 'Canvas', 'Web Audio', 'Electron', 'GitHub Actions'],
      links: [['GitHub', 'https://github.com/MarkfuGod/atari-portal'], [{ en: 'Open full screen', zh: '全屏打开' }, 'https://markfugod.github.io/atari-portal/']]
    },
    {
      id: 'piasm', cover: 'assets/covers/piasm.svg', cats: ['fun', 'agents'], kind: { en: 'Personal · 2026', zh: '个人项目 · 2026' },
      title: { en: 'pi-asm', zh: 'pi-asm' },
      line: { en: 'A coding agent written in ARM64 assembly, with a sandboxed multi-user server.', zh: '用 ARM64 汇编写的编程 Agent，附带沙箱化多用户服务端。' },
      metric: { en: 'macOS + Linux', zh: 'macOS + Linux' },
      sum: { en: 'A port of the Pi coding agent to ARM64 assembly, running on macOS and Linux, with a sandboxed multi-user server.', zh: '把 Pi 编程 Agent 移植到 ARM64 汇编，支持 macOS 与 Linux，并提供沙箱化的多用户服务端。' },
      problem: { en: 'How small and close to the metal can a working coding agent be?', zh: '一个能用的编程 Agent 能做到多小、多贴近硬件？' },
      built: { en: 'The agent loop in ARM64 assembly for macOS and Linux, plus a sandboxed server for multiple users.', zh: '用 ARM64 汇编实现 Agent 循环（macOS 与 Linux），外加多用户沙箱服务端。' },
      result: { en: 'Open source on GitHub.', zh: '已在 GitHub 开源。' },
      viz: null,
      tags: ['ARM64 assembly', 'macOS', 'Linux', 'Sandboxing'],
      links: [['GitHub', 'https://github.com/MarkfuGod/pi-asm']]
    }
  ];

  var SKILLS = [
    [{ en: 'Languages', zh: '编程语言' }, ['Go', 'TypeScript / JavaScript', 'Python', 'Swift', 'Java', 'SQL', 'C/C++']],
    [{ en: 'AI / LLM systems', zh: 'AI / LLM 系统' }, ['Agentic RAG', { en: 'Multi-agent systems', zh: '多 Agent 系统' }, 'MCP', { en: 'Tool calling', zh: '工具调用' }, 'OpenClaw', 'Hermes Agent', 'Pi Agent', 'CrewAI', 'vLLM', 'LiteLLM', 'Ollama', 'PyTorch', 'FSDP', 'Chroma']],
    [{ en: 'Backend & platform', zh: '后端与平台' }, ['PostgreSQL (Neon)', 'Redis', 'FastAPI', 'Node.js', { en: 'Stripe payments', zh: 'Stripe 支付' }, 'REST / OpenAPI', 'Docker', 'AWS (CDK, ECS, RDS)', 'GCP Cloud Run', 'Prometheus / Grafana', 'CI/CD']],
    [{ en: 'Web & mobile', zh: 'Web 与移动端' }, ['Next.js', 'React', 'Tailwind CSS', 'SwiftUI / SwiftData', 'Electron', 'Phaser 3', 'Three.js']]
  ];

  /* ---------------- render ---------------- */
  var current = 'all';

  function renderStatic() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(function (n) { n.textContent = T(I18N[n.dataset.i18n]); });
    document.getElementById('langBtn').textContent = lang === 'zh' ? 'English' : '中文';
    document.getElementById('resumeBtn').href = lang === 'zh' ? 'index_zh_industrial.html' : 'index_en_industrial.html';
    document.getElementById('mClose').textContent = T(I18N['m.close']);
    syncThemeLabel();
  }

  function renderWork() {
    var box = document.getElementById('timeline'); box.innerHTML = '';
    WORK.forEach(function (w) {
      var ul = el('ul', {}, T(w.pts).map(function (p) { return el('li', { text: p }); }));
      ul.appendChild(el('li', {}, [el('a', { href: '#p=' + w.open, text: lang === 'zh' ? '对应项目' : 'Related project' })]));
      box.appendChild(el('li', { class: 'job' }, [
        el('span', { class: 'when', text: T(w.when) }),
        el('div', { class: 'what' }, [
          el('b', { text: T(w.role) }), el('span', { class: 'org', text: ', ' + T(w.org) }),
          el('p', { class: 'hook', text: T(w.hook) }),
          el('details', {}, [el('summary', { text: T(I18N['m.more']) }), ul])
        ])
      ]));
    });
  }

  function renderFilters() {
    var box = document.getElementById('filters'); box.innerHTML = '';
    CATS.forEach(function (c) {
      box.appendChild(el('button', { type: 'button', 'aria-pressed': String(c.id === current), onclick: function () { current = c.id; renderFilters(); applyFilter(); } }, [T(c.l)]));
    });
  }

  function renderGrid() {
    var box = document.getElementById('grid'); box.innerHTML = '';
    P.forEach(function (p) {
      box.appendChild(el('li', { class: 'proj', 'data-cats': p.cats.join(' ') }, [
        el('button', { type: 'button', onclick: function () { location.hash = 'p=' + p.id; } }, [
          el('img', { src: p.cover || p.img, alt: '', loading: 'lazy', width: '640', height: '360' }),
          el('div', {}, [
            el('div', { class: 'meta', text: T(p.kind) }),
            el('div', { class: 't', text: T(p.title) }),
            el('div', { class: 'l', text: T(p.line) }),
            el('div', { class: 'n', text: T(p.metric) })
          ])
        ])
      ]));
    });
    applyFilter();
  }

  function applyFilter() {
    document.querySelectorAll('.proj').forEach(function (c) { c.classList.toggle('hide', current !== 'all' && c.dataset.cats.split(' ').indexOf(current) < 0); });
  }

  function renderSkills() {
    var box = document.getElementById('skillList'); box.innerHTML = '';
    SKILLS.forEach(function (s) {
      box.appendChild(el('dt', { text: T(s[0]) }));
      box.appendChild(el('dd', { text: s[1].map(T).join(', ') }));
    });
  }

  /* ---------------- visualisations ---------------- */
  function barsViz(groups) {
    var box = el('div', { class: 'bars' });
    groups.forEach(function (g) {
      box.appendChild(el('h6', { text: T(g.t) }));
      g.rows.forEach(function (r) {
        var fill = el('div', { class: 'fill' + (r[3] ? ' hi' : ''), 'data-w': (r[1] / g.max * 100).toFixed(1) });
        box.appendChild(el('div', { class: 'bar' }, [el('span', { class: 'lbl', text: T(r[0]) }), el('div', { class: 'track' }, [fill]), el('span', { class: 'val', text: r[2] })]));
      });
    });
    return box;
  }

  function pickable(items, container) {
    var detail = el('div', { class: 'detail', 'aria-live': 'polite' });
    var buttons = [];
    items.forEach(function (it, i) {
      var b = el('button', { class: 'node', type: 'button', 'aria-pressed': 'false', onclick: function () {
        buttons.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        detail.innerHTML = ''; detail.appendChild(el('b', { text: T(it[0]) + ' — ' })); detail.appendChild(document.createTextNode(T(it[1])));
      } }, [T(it[0])]);
      buttons.push(b); it.btn = b;
    });
    return { detail: detail, buttons: buttons };
  }

  function archViz(v) {
    var wrap = el('div');
    wrap.appendChild(el('p', { class: 'viz-hint', text: T(I18N['viz.click']) }));
    var all = []; v.layers.forEach(function (l) { l.nodes.forEach(function (n) { all.push(n); }); });
    var pk = pickable(all);
    var arch = el('div', { class: 'arch' }); var i = 0;
    v.layers.forEach(function (l) {
      var nodes = el('div', { class: 'nodes' });
      l.nodes.forEach(function () { nodes.appendChild(pk.buttons[i++]); });
      arch.appendChild(el('div', { class: 'layer' }, [el('span', { text: T(l.name) }), nodes]));
    });
    wrap.appendChild(arch); wrap.appendChild(pk.detail);
    pk.buttons[1].click();
    if (v.bars) { var b = barsViz(v.bars); b.style.marginTop = '20px'; wrap.appendChild(b); }
    return wrap;
  }

  function flowViz(v) {
    var wrap = el('div');
    wrap.appendChild(el('p', { class: 'viz-hint', text: T(I18N['viz.click']) }));
    var pk = pickable(v.steps);
    var flow = el('div', { class: 'flow' });
    pk.buttons.forEach(function (b, i) { if (i) flow.appendChild(el('span', { class: 'arrow', text: '→' })); flow.appendChild(b); });
    wrap.appendChild(flow); wrap.appendChild(pk.detail);
    pk.buttons[4].click();
    return wrap;
  }

  function galleryViz(v) {
    var wrap = el('div', { class: 'gallery' });
    var img = el('img', { src: v.shots[0][0], alt: T(v.shots[0][1]) });
    var cap = el('p', { class: 'cap', text: T(v.shots[0][1]) });
    var thumbs = el('div', { class: 'thumbs' });
    v.shots.forEach(function (s, i) {
      var b = el('button', { type: 'button', 'aria-pressed': String(i === 0), 'aria-label': T(s[1]), onclick: function () {
        img.src = s[0]; img.alt = T(s[1]); cap.textContent = T(s[1]);
        thumbs.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); b.setAttribute('aria-pressed', 'true');
      } }, [el('img', { src: s[0], alt: '', loading: 'lazy' })]);
      thumbs.appendChild(b);
    });
    wrap.appendChild(el('div', { class: 'main' }, [img])); wrap.appendChild(cap); wrap.appendChild(thumbs);
    if (v.bars) { var b = barsViz(v.bars); b.style.marginTop = '20px'; wrap.appendChild(b); }
    return wrap;
  }

  function embedViz(v) {
    var box = el('div', { class: 'embed' });
    box.appendChild(el('button', { type: 'button', onclick: function () {
      box.innerHTML = ''; box.appendChild(el('iframe', { src: v.src, title: 'Atari Portal', allow: 'autoplay; fullscreen', allowfullscreen: '' }));
    } }, [T(I18N.play)]));
    return box;
  }

  function viz(p) {
    var v = p.viz; if (!v) return p.cover ? el('img', { class: 'cover-big', src: p.cover, alt: '' }) : null;
    if (v.type === 'arch') return archViz(v);
    if (v.type === 'flow') return flowViz(v);
    if (v.type === 'gallery') return galleryViz(v);
    if (v.type === 'bars') return barsViz(v.bars);
    if (v.type === 'embed') return embedViz(v);
    if (v.type === 'svg') return el('div', { class: 'svgbox' }, [el('img', { src: v.src, alt: T(p.title) + ' architecture' })]);
  }

  /* ---------------- modal ---------------- */
  var modal = document.getElementById('modal');
  function openProject(id) {
    var p = P.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    document.getElementById('mMeta').textContent = T(p.kind);
    document.getElementById('mTitle').textContent = T(p.title);
    document.getElementById('mSum').textContent = T(p.sum);
    var vz = document.getElementById('mViz'); vz.innerHTML = ''; var node = viz(p); if (node) vz.appendChild(node); vz.style.display = node ? '' : 'none';
    var body = document.getElementById('mBody'); body.innerHTML = '';
    [['m.problem', p.problem], ['m.built', p.built], ['m.result', p.result]].forEach(function (c) { body.appendChild(el('section', {}, [el('h5', { text: T(I18N[c[0]]) }), el('p', { text: T(c[1]) })])); });
    document.getElementById('mTags').textContent = p.tags.join(', ');
    var links = document.getElementById('mLinks'); links.innerHTML = '';
    p.links.forEach(function (l) { var ext = /^https?:/.test(l[1]); links.appendChild(el('a', ext ? { href: l[1], target: '_blank', rel: 'noopener' } : { href: l[1] }, [T(l[0])])); });
    if (!modal.open) modal.showModal();
    modal.querySelector('.m-in').scrollTop = 0;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      modal.querySelectorAll('.fill').forEach(function (f) { f.style.width = f.dataset.w + '%'; });
    }); });
  }
  function closeModal() { if (modal.open) modal.close(); }
  modal.addEventListener('close', function () {
    document.getElementById('mViz').innerHTML = ''; // stops the embedded game
    if (/^#p=/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search + '#projects');
  });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.getElementById('mClose').addEventListener('click', closeModal);

  function route() { var m = location.hash.match(/^#p=([\w-]+)/); if (m) openProject(m[1]); }
  window.addEventListener('hashchange', route);

  /* ---------------- toggles ---------------- */
  document.getElementById('langBtn').addEventListener('click', function () {
    lang = lang === 'zh' ? 'en' : 'zh';
    try { localStorage.setItem('lang', lang); } catch (e) {}
    renderAll();
    var m = location.hash.match(/^#p=([\w-]+)/); if (m && modal.open) openProject(m[1]);
  });
  document.getElementById('themeBtn').addEventListener('click', function () {
    var root = document.documentElement;
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    syncThemeLabel();
  });

  function isDark() { var r = document.documentElement; return r.dataset.theme ? r.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; }
  function syncThemeLabel() { document.getElementById('themeBtn').textContent = T(I18N[isDark() ? 'nav.light' : 'nav.dark']); }

  function renderAll() { renderStatic(); renderWork(); renderFilters(); renderGrid(); renderSkills(); }
  renderAll();
  route();
})();
