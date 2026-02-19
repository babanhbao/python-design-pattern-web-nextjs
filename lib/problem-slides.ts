import { sections, slugify } from "./pattern-data";

export type Lang = "en" | "vi";

export type I18nText = {
  en: string;
  vi: string;
};

export type I18nList = {
  en: string[];
  vi: string[];
};

export type ComparisonRow = {
  aspect: I18nText;
  noPattern: I18nText;
  withPattern: I18nText;
};

export type RecognitionCue = {
  cue: I18nText;
  code: string;
  explanation: I18nText;
};

export type UmlStage = {
  title: I18nText;
  thinking: I18nText;
  graph: {
    nodes: Array<{
      id: string;
      label: string;
      x: number;
      y: number;
    }>;
    edges: Array<{
      from: string;
      to: string;
      label?: string;
    }>;
  };
};

export type ProblemLesson = {
  id: string;
  order: number;
  businessProblem: I18nText;
  team: I18nText;
  problemLabel: I18nText;
  section: I18nText;
  title: string;
  difficulty: I18nText;
  context: I18nText;
  architecturalGoal: I18nText;
  problem: I18nText;
  problemNarrative: I18nList;
  pain: I18nList;
  painBlocks: Array<{
    heading: I18nText;
    details: I18nList;
  }>;
  solution: I18nList;
  recognitionCues: RecognitionCue[];
  coupling: {
    before: I18nText;
    after: I18nText;
    insights: I18nList;
  };
  couplingDiagramBefore: string;
  couplingDiagramAfter: string;
  naiveCode: string;
  patternCode: string;
  modernCode: string;
  patternCodeCommentary: I18nList;
  modernCodeCommentary: I18nList;
  umlStages: UmlStage[];
  comparison: ComparisonRow[];
  analogy: I18nText;
  strategicOutcome: I18nList;
  coreInsight: I18nText;
};

type ScenarioMeta = {
  context: I18nText;
  problem: I18nText;
  analogy: I18nText;
  roles: string[];
};

const sectionLabelMap: Record<string, I18nText> = {
  "SOLID Design Principles": {
    en: "SOLID Design Principles",
    vi: "Nguyên lý thiết kế SOLID"
  },
  "Creational Design Patterns": {
    en: "Creational Design Patterns",
    vi: "Nhóm pattern khởi tạo đối tượng"
  },
  "Structural Design Patterns": {
    en: "Structural Design Patterns",
    vi: "Nhóm pattern cấu trúc"
  },
  "Behavioral Design Patterns": {
    en: "Behavioral Design Patterns",
    vi: "Nhóm pattern hành vi"
  }
};

const scenarioMap: Record<string, ScenarioMeta> = {
  "Single Responsibility Principle": {
    context: {
      en: "Invoice & reporting module",
      vi: "Module hóa đơn & báo cáo"
    },
    problem: {
      en: "`JobOrchestrator` was meant to orchestrate, but it now also plays every instrument: create invoices, save them, render PDFs, notify users, log audits, and babysit retries.",
      vi: "`JobOrchestrator` lẽ ra chỉ điều phối, nhưng giờ nó kiêm luôn: tạo invoice, lưu, render PDF, gửi thông báo, ghi audit, và canh retry."
    },
    analogy: {
      en: "A chef should cook. If the chef also does accounting, purchasing, delivery, and payroll, dinner will be late (and messy).",
      vi: "Đầu bếp nên nấu ăn. Nếu đầu bếp kiêm luôn kế toán, mua hàng, giao hàng, và trả lương thì bữa tối sẽ trễ (và rối tung)."
    },
    roles: ["InvoiceService", "InvoiceRepository", "PdfRenderer", "Notifier"]
  },
  "Open-Closed Principle": {
    context: {
      en: "Pricing and discount engine",
      vi: "Động cơ tính giá và giảm giá"
    },
    problem: {
      en: "Every new discount type forces edits to a long if/elif chain in production code.",
      vi: "Mỗi loại giảm giá mới đều buộc sửa chuỗi if/elif dài trong code production."
    },
    analogy: {
      en: "A power strip adds sockets without rewiring the whole house.",
      vi: "Ổ cắm điện tốt cho phép thêm cổng mà không phải đi lại dây cả nhà."
    },
    roles: ["PriceCalculator", "DiscountPolicy", "HolidayPolicy", "MemberPolicy"]
  },
  "Liskov Substitution Principle": {
    context: {
      en: "Storage driver replacement",
      vi: "Thay thế driver lưu trữ"
    },
    problem: {
      en: "Some storage subclasses break expected behavior of the base interface under normal calls.",
      vi: "Một số subclass lưu trữ phá vỡ hành vi kỳ vọng của interface gốc trong call thông thường."
    },
    analogy: {
      en: "Any car with pedals should brake when the brake pedal is pressed.",
      vi: "Bất kỳ xe nào có bàn đạp phanh thì đạp phanh phải dừng."
    },
    roles: ["Storage", "SqlStorage", "S3Storage", "CacheStorage"]
  },
  "Interface Segregation Principle": {
    context: {
      en: "Device control interfaces",
      vi: "Interface điều khiển thiết bị"
    },
    problem: {
      en: "Clients depend on giant interfaces and must implement methods they never use.",
      vi: "Client phụ thuộc interface quá lớn và phải implement method không bao giờ dùng."
    },
    analogy: {
      en: "A TV remote should not include airplane cockpit controls.",
      vi: "Remote TV không nên chứa nút điều khiển buồng lái máy bay."
    },
    roles: ["Printer", "Scanner", "FaxSender", "MultiFunctionDevice"]
  },
  "Dependency Inversion Principle": {
    context: {
      en: "Notification orchestration",
      vi: "Điều phối thông báo"
    },
    problem: {
      en: "High-level services import concrete email/sms providers directly.",
      vi: "Service cấp cao import trực tiếp provider email/sms concrete."
    },
    analogy: {
      en: "Devices plug into a socket standard, not directly into a power plant.",
      vi: "Thiết bị cắm vào chuẩn ổ cắm, không cắm trực tiếp vào nhà máy điện."
    },
    roles: ["NotificationService", "MessageGateway", "EmailGateway", "SmsGateway"]
  },
  Builder: {
    context: {
      en: "Complex pipeline configuration",
      vi: "Cấu hình pipeline phức tạp"
    },
    problem: {
      en: "Constructing a pipeline object needs many optional fields and ordering constraints.",
      vi: "Khởi tạo object pipeline cần nhiều field tuỳ chọn và ràng buộc thứ tự."
    },
    analogy: {
      en: "Building a burger step-by-step with custom options.",
      vi: "Làm burger từng bước với nhiều lựa chọn tuỳ biến."
    },
    roles: ["PipelineBuilder", "PipelineConfig", "ValidationFacet", "ExecutionFacet"]
  },
  "Factories (Factory Method and Abstract Factory)": {
    context: {
      en: "Processor creation by job type",
      vi: "Tạo processor theo loại job"
    },
    problem: {
      en: "Object creation branches are duplicated across workers and API handlers.",
      vi: "Nhánh tạo object bị lặp lại ở workers và API handlers."
    },
    analogy: {
      en: "A hospital reception routes patients to the right specialist.",
      vi: "Quầy tiếp nhận bệnh viện điều hướng bệnh nhân đến đúng chuyên khoa."
    },
    roles: ["ProcessorFactory", "Processor", "ImageProcessor", "VideoProcessor"]
  },
  Prototype: {
    context: {
      en: "Preset model profiles",
      vi: "Profile model mẫu"
    },
    problem: {
      en: "You repeatedly recreate similar deep configuration objects with tiny variations.",
      vi: "Bạn lặp lại việc tạo config sâu giống nhau chỉ khác một vài giá trị nhỏ."
    },
    analogy: {
      en: "Copying a template document before editing.",
      vi: "Copy một mẫu tài liệu trước khi chỉnh sửa."
    },
    roles: ["ProfilePrototype", "FastProfile", "AccurateProfile", "ProfileFactory"]
  },
  Singleton: {
    context: {
      en: "Global runtime configuration",
      vi: "Cấu hình runtime toàn cục"
    },
    problem: {
      en: "Different modules instantiate conflicting configuration objects.",
      vi: "Nhiều module khởi tạo các config xung đột nhau."
    },
    analogy: {
      en: "One control tower coordinates one airport.",
      vi: "Một tháp điều khiển phụ trách một sân bay."
    },
    roles: ["AppConfig", "ConfigSingleton", "ConfigProvider"]
  },
  Adapter: {
    context: {
      en: "Legacy OCR integration",
      vi: "Tích hợp OCR cũ"
    },
    problem: {
      en: "A legacy library exposes an incompatible API with your new pipeline contracts.",
      vi: "Thư viện cũ có API không tương thích với contract của pipeline mới."
    },
    analogy: {
      en: "A travel plug adapter converts socket shape without changing the device.",
      vi: "Đầu chuyển ổ cắm du lịch đổi hình dáng cổng mà không đổi thiết bị."
    },
    roles: ["OcrAdapter", "LegacyOcrClient", "TextExtractor", "PipelineStage"]
  },
  Bridge: {
    context: {
      en: "Processing abstraction across CPU and GPU backends",
      vi: "Trừu tượng xử lý trên backend CPU và GPU"
    },
    problem: {
      en: "Abstraction and implementation dimensions are changing independently.",
      vi: "Hai trục trừu tượng và implementation thay đổi độc lập."
    },
    analogy: {
      en: "A universal remote can switch among many TV brands.",
      vi: "Một remote đa năng có thể điều khiển nhiều hãng TV."
    },
    roles: ["ImageProcessor", "ComputeBackend", "CpuBackend", "GpuBackend"]
  },
  Composite: {
    context: {
      en: "Batch tree processing",
      vi: "Xử lý cây batch"
    },
    problem: {
      en: "You need to treat a single task and a group of tasks uniformly.",
      vi: "Bạn cần xử lý task đơn và nhóm task một cách đồng nhất."
    },
    analogy: {
      en: "A company treats teams and individuals as organizational units.",
      vi: "Doanh nghiệp xem cả nhóm và cá nhân đều là đơn vị tổ chức."
    },
    roles: ["Task", "TaskLeaf", "TaskGroup", "BatchRunner"]
  },
  Decorator: {
    context: {
      en: "Adding retries and audit logs",
      vi: "Thêm retry và audit log"
    },
    problem: {
      en: "You want optional runtime behaviors without modifying core processor classes.",
      vi: "Bạn muốn bổ sung hành vi tuỳ chọn lúc chạy mà không sửa core processor."
    },
    analogy: {
      en: "Wearing layers of clothing based on weather.",
      vi: "Mặc thêm nhiều lớp áo theo thời tiết."
    },
    roles: ["Processor", "RetryDecorator", "LoggingDecorator", "CoreProcessor"]
  },
  Facade: {
    context: {
      en: "Full recognition workflow API",
      vi: "API workflow nhận diện đầy đủ"
    },
    problem: {
      en: "Clients must call many subsystems in strict order and often get sequencing wrong.",
      vi: "Client phải gọi nhiều subsystem theo thứ tự chặt chẽ và thường bị sai thứ tự."
    },
    analogy: {
      en: "A hotel front desk coordinates many internal services for guests.",
      vi: "Lễ tân khách sạn điều phối nhiều dịch vụ bên trong cho khách."
    },
    roles: ["RecognitionFacade", "Detector", "Classifier", "StorageGateway"]
  },
  Flyweight: {
    context: {
      en: "Large detection metadata",
      vi: "Metadata detection số lượng lớn"
    },
    problem: {
      en: "Millions of objects duplicate immutable metadata and waste memory.",
      vi: "Hàng triệu object lặp lại metadata bất biến gây tốn bộ nhớ."
    },
    analogy: {
      en: "Characters in a document share font glyph definitions.",
      vi: "Ký tự trong tài liệu dùng chung định nghĩa glyph của font."
    },
    roles: ["Detection", "DetectionType", "FlyweightFactory", "RenderService"]
  },
  Proxy: {
    context: {
      en: "Heavy model loading",
      vi: "Nạp model nặng"
    },
    problem: {
      en: "Expensive resources are created even when most requests do not need them.",
      vi: "Tài nguyên đắt đỏ được tạo ngay cả khi phần lớn request không cần."
    },
    analogy: {
      en: "A personal assistant filters calls before reaching you.",
      vi: "Trợ lý cá nhân sàng lọc cuộc gọi trước khi chuyển đến bạn."
    },
    roles: ["ModelProxy", "HeavyModel", "ModelInterface", "InferenceService"]
  },
  "Chain of Responsibility": {
    context: {
      en: "Request validation and fallback",
      vi: "Validation request và fallback"
    },
    problem: {
      en: "An ordered set of checks should process input until one handles or rejects it.",
      vi: "Tập check theo thứ tự cần xử lý input đến khi có check handle hoặc reject."
    },
    analogy: {
      en: "Airport security checks passengers through multiple gates.",
      vi: "An ninh sân bay kiểm tra hành khách qua nhiều cửa."
    },
    roles: ["Handler", "AuthHandler", "SchemaHandler", "RiskHandler"]
  },
  Command: {
    context: {
      en: "Job queue execution",
      vi: "Thực thi hàng đợi job"
    },
    problem: {
      en: "You need queue, retry, and audit without coupling dispatcher to concrete tasks.",
      vi: "Bạn cần queue, retry, audit mà không coupling dispatcher vào task concrete."
    },
    analogy: {
      en: "Restaurant order tickets decouple waiter from kitchen execution.",
      vi: "Phiếu gọi món tách phục vụ khỏi quá trình bếp thực thi."
    },
    roles: ["Command", "ProcessImageCommand", "CommandBus", "WorkerReceiver"]
  },
  Interpreter: {
    context: {
      en: "Mini query language for filters",
      vi: "Ngôn ngữ truy vấn mini cho bộ lọc"
    },
    problem: {
      en: "Users express filtering rules as text that must be parsed and executed safely.",
      vi: "Người dùng mô tả luật lọc bằng text cần được parse và thực thi an toàn."
    },
    analogy: {
      en: "Reading symbols by grammar rules instead of guessing meaning.",
      vi: "Đọc ký hiệu theo ngữ pháp thay vì đoán nghĩa."
    },
    roles: ["Lexer", "Parser", "Expression", "Context"]
  },
  Iterator: {
    context: {
      en: "Traversing complex frame collections",
      vi: "Duyệt tập frame phức tạp"
    },
    problem: {
      en: "Traversal logic is duplicated and inconsistent across modules.",
      vi: "Logic duyệt bị lặp lại và không đồng nhất giữa các module."
    },
    analogy: {
      en: "A playlist next button hides list traversal details.",
      vi: "Nút next của playlist ẩn chi tiết duyệt danh sách."
    },
    roles: ["FrameCollection", "FrameIterator", "CursorState", "Client"]
  },
  Mediator: {
    context: {
      en: "UI controls and worker coordination",
      vi: "Điều phối control UI và worker"
    },
    problem: {
      en: "Components communicate in a web of direct references and become hard to change.",
      vi: "Component giao tiếp bằng mạng lưới reference trực tiếp nên khó thay đổi."
    },
    analogy: {
      en: "An air traffic controller coordinates planes instead of planes calling each other.",
      vi: "Kiểm soát không lưu điều phối máy bay thay vì máy bay gọi trực tiếp cho nhau."
    },
    roles: ["Mediator", "UiPanel", "WorkerAgent", "EventBus"]
  },
  Memento: {
    context: {
      en: "Undo/redo for tuning settings",
      vi: "Undo/redo cho tham số tuning"
    },
    problem: {
      en: "Users need to rollback configuration states without exposing internals everywhere.",
      vi: "Người dùng cần rollback state cấu hình mà không lộ nội bộ ở mọi nơi."
    },
    analogy: {
      en: "Game save points let you return to previous checkpoints.",
      vi: "Điểm save game cho phép quay lại checkpoint trước."
    },
    roles: ["Originator", "Memento", "Caretaker", "HistoryStack"]
  },
  Observer: {
    context: {
      en: "Shared state updates tile colors",
      vi: "State dùng chung cập nhật màu tile"
    },
    problem: {
      en: "Many UI parts must react to state updates without manual wiring every time.",
      vi: "Nhiều phần UI cần phản ứng khi state đổi mà không cần wiring thủ công mỗi lần."
    },
    analogy: {
      en: "Subscribers receive stock ticker updates when prices change.",
      vi: "Người đăng ký nhận tin ticker khi giá cổ phiếu thay đổi."
    },
    roles: ["ObservableState", "Observer", "TileView", "SummaryView"]
  },
  State: {
    context: {
      en: "Job lifecycle control",
      vi: "Điều khiển vòng đời job"
    },
    problem: {
      en: "Valid actions depend heavily on current state and rules are scattered.",
      vi: "Action hợp lệ phụ thuộc mạnh vào state hiện tại và rule bị phân tán."
    },
    analogy: {
      en: "A vending machine changes behavior by current state.",
      vi: "Máy bán hàng tự động đổi hành vi theo từng state."
    },
    roles: ["JobContext", "State", "QueuedState", "RunningState", "FailedState"]
  },
  Strategy: {
    context: {
      en: "Multiple worker processing algorithms",
      vi: "Nhiều thuật toán xử lý worker"
    },
    problem: {
      en: "Different worker types need swappable algorithms with one stable entry point.",
      vi: "Nhiều loại worker cần thuật toán hoán đổi được với một điểm vào ổn định."
    },
    analogy: {
      en: "You choose car, bike, or subway strategy by travel context.",
      vi: "Bạn chọn chiến lược di chuyển bằng xe hơi, xe đạp, hoặc tàu điện theo bối cảnh."
    },
    roles: ["WorkerContext", "ProcessingStrategy", "ThumbStrategy", "ClassifyStrategy"]
  },
  Template: {
    context: {
      en: "Standard pipeline execution skeleton",
      vi: "Khung xử lý pipeline tiêu chuẩn"
    },
    problem: {
      en: "Pipeline steps are similar but each variant customizes only a few hooks.",
      vi: "Các bước pipeline gần giống nhau nhưng mỗi biến thể chỉ cần tuỳ biến vài hook."
    },
    analogy: {
      en: "A cooking recipe defines fixed steps with customizable ingredients.",
      vi: "Công thức nấu ăn có khung bước cố định và nguyên liệu thay đổi."
    },
    roles: ["BasePipeline", "ImagePipeline", "VideoPipeline", "PipelineRunner"]
  },
  Visitor: {
    context: {
      en: "Analytics over object graph",
      vi: "Phân tích trên đồ thị đối tượng"
    },
    problem: {
      en: "You need many operations over a stable object structure without editing each class repeatedly.",
      vi: "Bạn cần nhiều phép toán trên cấu trúc đối tượng ổn định mà không sửa class liên tục."
    },
    analogy: {
      en: "A museum guide gives different tours over the same set of exhibits.",
      vi: "Hướng dẫn viên bảo tàng có nhiều tour khác nhau trên cùng bộ hiện vật."
    },
    roles: ["Visitor", "Node", "ReportVisitor", "CostVisitor"]
  }
};

const lessonOverrides: Record<string, Partial<ProblemLesson>> = {
  "Single Responsibility Principle": {
    architecturalGoal: {
      en: "Stabilize orchestration, isolate volatility, and reduce change amplification.",
      vi: "Ổn định orchestration, tách volatility, và giảm change amplification."
    },
    problemNarrative: {
      en: [
        "Meet `JobOrchestrator`. Day 1: it coordinated. Day 90: it coordinates AND does the work.",
        "In the Invoice & Reporting module it creates invoices, saves them, renders PDFs, sends notifications, writes audit trails, and manages retries.",
        "When orchestration becomes execution, the class turns into a change magnet.",
        "SRP (in human words): one class should have one reason to change.",
        "Right now it has many: rules, storage, PDF engine, notification channels, retry policy."
      ],
      vi: [
        "Gặp `JobOrchestrator`. Ngày đầu nó chỉ điều phối. Với thời gian nó kiêm luôn mọi việc.",
        "Trong module Invoice & Reporting nó tự tạo invoice, tự lưu, tự render PDF, tự gửi thông báo, tự ghi audit, tự canh retry.",
        "Khi orchestration biến thành execution, class này trở thành 'nam châm thay đổi'.",
        "SRP (nói na): một class chỉ nên có một lý do thay đổi.",
        "Còn hiện tại? Rule đổi, storage đổi, PDF engine đổi, kênh notify đổi, retry policy đổi... đều đập vào nó."
      ]
    },
    pain: {
      en: [
        "New invoice template? Suddenly you touched persistence + notifications too. Domino effect.",
        "Swap the PDF library? You end up editing orchestration/business code. Yikes.",
        "Unit tests become an Avengers crossover: DB mocks, renderer mocks, notifier mocks, retry mocks.",
        "Onboarding feels like: \"Where do I safely change X?\" -> \"Somewhere inside `JobOrchestrator`...\""
      ],
      vi: [
        "Thêm template invoice mới? Bất ngờ bạn động cả persistence + notify. Hiệu ứng domino.",
        "Đổi thư viện PDF? Tưởng đổi config, cuối cùng phải sửa orchestration/business code.",
        "Unit test như gọi Avengers: mock DB, mock renderer, mock notifier, mock retry.",
        "Onboarding: \"Sửa X ở đâu cho an toàn?\" -> \"Trong `JobOrchestrator`...\""
      ]
    },
    painBlocks: [
      {
        heading: { en: "1. Change Amplification", vi: "1. Change Amplification" },
        details: {
          en: [
            "A tiny change (ex: new template) forces edits across rendering, persistence, notification, and audit paths.",
            "Regression risk climbs because unrelated concerns ship together.",
            "Review + QA time expands because the blast radius is unclear."
          ],
          vi: [
            "Một thay đổi nhỏ (ví dụ: template) buộc sửa cả render, persistence, notify, audit.",
            "Rủi ro regression tăng vì concern không liên quan bị đóng gói chung.",
            "Review/QA tốn thời gian vì blast radius không rõ."
          ]
        }
      },
      {
        heading: { en: "2. Behavioral Coupling", vi: "2. Behavioral Coupling" },
        details: {
          en: [
            "Policy code imports concrete infrastructure (`SqlInvoiceRepository`, PDF engine, email notifier).",
            "Replacing infrastructure becomes a code edit, not a plug-and-play swap.",
            "Business logic and vendor SDKs start negotiating inside the same class."
          ],
          vi: [
            "Policy code import thẳng infrastructure concrete (`SqlInvoiceRepository`, PDF engine, email notifier).",
            "Thay infrastructure thành 'sửa code' thay vì 'đổi module'.",
            "Business logic và vendor SDK bắt đầu... ở chung một nhà."
          ]
        }
      },
      {
        heading: { en: "3. Testing Friction", vi: "3. Testing Friction" },
        details: {
          en: [
            "To unit-test orchestration, you have to fake the whole world.",
            "Mocks outnumber assertions; wiring overwhelms intent.",
            "Tests become brittle: change one dependency, dozens of tests fall."
          ],
          vi: [
            "Muốn unit-test orchestration, bạn phải giả lập cả thế giới.",
            "Số mock nhiều hơn assert; wiring lấn át intent.",
            "Test brittle: đổi một dependency, hàng loạt test ngã."
          ]
        }
      },
      {
        heading: { en: "4. Developer Cognitive Load", vi: "4. Developer Cognitive Load" },
        details: {
          en: [
            "Everything routes through one mega-class, so \"safe\" changes are hard to spot.",
            "Ownership boundaries blur; everyone edits the same hotspot.",
            "Velocity drops because risk management becomes the real job."
          ],
          vi: [
            "Mọi thứ đều chạy qua một mega-class, nên khó nhìn ra ranh giới an toàn.",
            "Ownership bị mờ; ai cũng sửa cùng một hotspot.",
            "Tốc độ giảm vì 'quản lý rủi ro' mới là công việc chính."
          ]
        }
      }
    ],
    solution: {
      en: [
        "Let `InvoiceService` be the conductor (policy only).",
        "Give each execution detail a contract: `InvoiceRepository`, `PdfRenderer`, `Notifier`.",
        "Swap implementations by composition/config, not by rewriting the orchestration flow."
      ],
      vi: [
        "Cho `InvoiceService` làm nhạc trưởng (chỉ policy/orchestration).",
        "Mỗi execution detail có một contract: `InvoiceRepository`, `PdfRenderer`, `Notifier`.",
        "Hoán đổi implementation bằng composition/config, không phải nhồi kết mới vào orchestration flow."
      ]
    },
    recognitionCues: [
      {
        cue: {
          en: "One class mixes branching policy + IO + cross-cutting (audit/retry).",
          vi: "Một class vừa có policy branching vừa làm IO vừa ôm cross-cutting (audit/retry)."
        },
        code: `class JobOrchestrator:
    def handle(self, invoice):
        if invoice.type == "A": ...
        else: ...

        self.repo.save(invoice)
        pdf = self.renderer.render(invoice)
        self.notifier.send(pdf)
        self.audit.log("invoice_sent", invoice.id)
        # self.retry_policy.run(...)`,
        explanation: {
          en: "If one method touches DB + PDF + notifications + audit + retries, orchestration has turned into execution.",
          vi: "Nếu một method chạm DB + PDF + thông báo + audit + retry, orchestration đã biến thành execution."
        }
      },
      {
        cue: {
          en: "Unrelated changes keep landing in the same file.",
          vi: "Thay đổi không liên quan cứ liên tục đập vào cùng một file."
        },
        code: `# job_orchestrator.py
from infra.sql import SqlInvoiceRepository
from infra.pdf import PdfRendererLibrary
from infra.notify import EmailNotifier
from infra.retry import RetryPolicy`,
        explanation: {
          en: "The import list itself reveals multiple reasons to change (storage, rendering, notifications, retries).",
          vi: "Chỉ nhìn danh sách import cũng thấy nhiều lý do thay đổi (lưu trữ, render, thông báo, retry)."
        }
      },
      {
        cue: {
          en: "Unit tests require many mocks just to reach one behavior.",
          vi: "Unit test cần nhiều mock chỉ để chạm được một hành vi."
        },
        code: `def test_orchestrator():
    repo = Mock()
    renderer = Mock()
    notifier = Mock()
    audit = Mock()
    retry = Mock()
    orch = JobOrchestrator(repo, renderer, notifier, audit, retry)
    assert orch.handle(invoice) is not None`,
        explanation: {
          en: "When mock setup dominates the test, SRP boundaries are usually blurred.",
          vi: "Khi test chủ yếu là dựng mock, ranh giới SRP thường đang bị mờ."
        }
      },
      {
        cue: {
          en: "The class name is a red-flag umbrella (Manager/Handler/Orchestrator).",
          vi: "Tên class kiểu 'ôm đồ': Manager/Handler/Orchestrator."
        },
        code: `class InvoiceManager:
    def do_everything(self, invoice): ...`,
        explanation: {
          en: "Umbrella names often hide multiple responsibilities behind one convenient entry point.",
          vi: "Tên kiểu 'ôm đồ' thường che nhiều trách nhiệm sau một entry point tưởng như tiện lợi."
        }
      },
      {
        cue: {
          en: "Swapping infrastructure forces edits to business logic.",
          vi: "Đổi infrastructure lại buộc sửa business logic."
        },
        code: `class JobOrchestrator:
    def __init__(self):
        self.repo = SqlInvoiceRepository()
        self.renderer = PdfRendererLibrary()
        self.notifier = EmailNotifier()`,
        explanation: {
          en: "Hard-coded concrete dependencies mean every vendor swap becomes a code change in the policy layer.",
          vi: "Hard-code dependency concrete khiến mỗi lần đổi vendor lại thành sửa code ở tầng policy."
        }
      }
    ],
    coupling: {
      before: {
        en: "`JobOrchestrator` depends on concrete things, so policy and infrastructure are tangled.",
        vi: "`JobOrchestrator` phụ thuộc thẳng concrete, nên policy và infrastructure bị đan xen."
      },
      after: {
        en: "Policy stays in `InvoiceService`; volatile infrastructure sits behind contracts and can be swapped safely.",
        vi: "Policy nằm trong `InvoiceService`; còn infrastructure hay đổi nằm sau contract và có thể hoán đổi an toàn."
      },
      insights: {
        en: [
          "Lower coupling reduces change amplification.",
          "Interfaces isolate volatility and enable substitution.",
          "Testing focuses on policy orchestration instead of infrastructure setup."
        ],
        vi: [
          "Coupling thấp giúp giảm change amplification.",
          "Interface tách volatility và cho phép thay thế.",
          "Test tập trung vào policy orchestration thay vì setup infrastructure."
        ]
      }
    },
    couplingDiagramBefore: `JobOrchestrator
 ├── SqlInvoiceRepository
 ├── PdfRendererLibrary
 ├── EmailNotifier
 └── RetryPolicy`,
    couplingDiagramAfter: `InvoiceService (orchestration policy)
    ↓
Interfaces
    ↓
InvoiceRepository → SqlInvoiceRepository, NoSqlInvoiceRepository
PdfRenderer      → S3PdfRenderer, LocalRenderer
Notifier         → EmailNotifier, SlackNotifier`,
    comparison: [
      {
        aspect: { en: "Change Cost", vi: "Chi phí thay đổi" },
        noPattern: { en: "Touch 1 thing, edit 5", vi: "Chạm 1 cái, sửa 5 nơi" },
        withPattern: { en: "Change stays near contracts", vi: "Sửa quanh contract" }
      },
      {
        aspect: { en: "Coupling", vi: "Độ coupling" },
        noPattern: { en: "Concrete dependency web", vi: "Mạng dependency concrete" },
        withPattern: { en: "Abstraction-driven", vi: "Theo abstraction/contract" }
      },
      {
        aspect: { en: "Testability", vi: "Khả năng test" },
        noPattern: { en: "Heavy mocks, slow feedback", vi: "Mock nhiều, feedback chậm" },
        withPattern: { en: "Focused unit scope", vi: "Unit test tập trung" }
      },
      {
        aspect: { en: "Extensibility", vi: "Khả năng mở rộng" },
        noPattern: { en: "Risky modifications", vi: "Sửa đổi rủi ro" },
        withPattern: { en: "Safe composition", vi: "Compose an toàn" }
      },
      {
        aspect: { en: "Deployment Flexibility", vi: "Linh hoạt deploy" },
        noPattern: { en: "Full redeploy needed", vi: "Thường cần redeploy toàn bộ" },
        withPattern: { en: "Replaceable modules", vi: "Module có thể thay thế" }
      }
    ],
    patternCodeCommentary: {
      en: [
        "Notice what's missing from `InvoiceService`: no SQL, no PDF SDK, no email vendor. That's the SRP boundary doing its job.",
        "`InvoiceService` coordinates; collaborators execute.",
        "You can swap implementations without rewriting the policy flow.",
        "Tests get cheaper: mock one contract at a time instead of mocking the whole zoo."
      ],
      vi: [
        "Để ý xem `InvoiceService` thiếu gì: không SQL, không PDF SDK, không email vendor. Đó là ranh giới SRP đang làm việc.",
        "`InvoiceService` chỉ điều phối; collaborator mới là nơi làm việc.",
        "Bạn hoán đổi implementation mà không phải viết lại policy flow.",
        "Test rẻ hơn: mock theo contract từng mảnh thay vì dựng cả 'vườn thú'."
      ]
    },
    umlStages: [
      {
        title: { en: "Stage 1: JobOrchestrator goes full octopus", vi: "Giai đoạn 1: JobOrchestrator hóa bạch tuộc" },
        thinking: {
          en: "One class holds policy, IO, rendering, notifications, audit, and retries. Everything is glued together.",
          vi: "Một class ôm cả policy, IO, render, notify, audit, và retry. Mọi thứ bị dán keo vào một khối."
        },
        graph: {
          nodes: [
            { id: "client", label: "Client", x: 12, y: 18 },
            { id: "orch", label: "JobOrchestrator", x: 40, y: 24 },
            { id: "repo", label: "SqlInvoiceRepository", x: 18, y: 62 },
            { id: "pdf", label: "PdfRendererLibrary", x: 44, y: 62 },
            { id: "notify", label: "EmailNotifier", x: 72, y: 62 },
            { id: "audit", label: "AuditLogger", x: 72, y: 34 },
            { id: "retry", label: "RetryPolicy", x: 40, y: 86 }
          ],
          edges: [
            { from: "client", to: "orch" },
            { from: "orch", to: "repo", label: "save" },
            { from: "orch", to: "pdf", label: "render" },
            { from: "orch", to: "notify", label: "notify" },
            { from: "orch", to: "audit", label: "log" },
            { from: "orch", to: "retry", label: "retry" }
          ]
        }
      },
      {
        title: { en: "Stage 2: Give orchestration a job description", vi: "Giai đoạn 2: Trả lại đúng vai trò điều phối" },
        thinking: {
          en: "Keep the policy flow in one place, but push execution behind contracts.",
          vi: "Giữ policy flow ở một nơi, nhưng đẩy execution ra sau contract."
        },
        graph: {
          nodes: [
            { id: "client", label: "Client", x: 12, y: 18 },
            { id: "svc", label: "InvoiceService", x: 38, y: 18 },
            { id: "repo", label: "InvoiceRepository", x: 18, y: 62 },
            { id: "pdf", label: "PdfRenderer", x: 44, y: 62 },
            { id: "notify", label: "Notifier", x: 72, y: 62 }
          ],
          edges: [
            { from: "client", to: "svc" },
            { from: "svc", to: "repo", label: "depends on" },
            { from: "svc", to: "pdf", label: "depends on" },
            { from: "svc", to: "notify", label: "depends on" }
          ]
        }
      },
      {
        title: { en: "Stage 3: Swap parts like Lego", vi: "Giai đoạn 3: Hoán đổi như lego" },
        thinking: {
          en: "Implementations become interchangeable while the policy stays stable.",
          vi: "Implementation có thể hoán đổi trong khi policy vẫn ổn định."
        },
        graph: {
          nodes: [
            { id: "client", label: "Client", x: 10, y: 14 },
            { id: "svc", label: "InvoiceService", x: 30, y: 14 },
            { id: "repo", label: "InvoiceRepository", x: 18, y: 44 },
            { id: "pdf", label: "PdfRenderer", x: 44, y: 44 },
            { id: "notify", label: "Notifier", x: 70, y: 44 },
            { id: "sql", label: "SqlInvoiceRepository", x: 10, y: 82 },
            { id: "nosql", label: "NoSqlInvoiceRepository", x: 26, y: 82 },
            { id: "s3", label: "S3PdfRenderer", x: 38, y: 82 },
            { id: "local", label: "LocalRenderer", x: 52, y: 82 },
            { id: "email", label: "EmailNotifier", x: 64, y: 82 },
            { id: "slack", label: "SlackNotifier", x: 82, y: 82 }
          ],
          edges: [
            { from: "client", to: "svc" },
            { from: "svc", to: "repo" },
            { from: "svc", to: "pdf" },
            { from: "svc", to: "notify" },
            { from: "sql", to: "repo", label: "implements" },
            { from: "nosql", to: "repo", label: "implements" },
            { from: "s3", to: "pdf", label: "implements" },
            { from: "local", to: "pdf", label: "implements" },
            { from: "email", to: "notify", label: "implements" },
            { from: "slack", to: "notify", label: "implements" }
          ]
        }
      }
    ],
    strategicOutcome: {
      en: [
        "Orchestration becomes boring (stable) - and that's a compliment.",
        "Infrastructure evolves independently (DB/PDF/notifier/retry).",
        "Tests become faster and less brittle.",
        "Change risk decreases and team throughput improves."
      ],
      vi: [
        "Orchestration trở nên 'chán' (ổn định) - và đó là lời khen.",
        "Infrastructure tiến hoá độc lập (DB/PDF/notifier/retry).",
        "Test nhanh hơn và ít brittle hơn.",
        "Rủi ro thay đổi giảm và thông lượng giao hàng tăng."
      ]
    },
    coreInsight: {
      en: "SRP is not about tiny classes. It's about isolating volatility and keeping stable policy from fighting unstable infrastructure.",
      vi: "SRP không phải chỉ là làm class nhỏ. Nó giúp tách volatility và giữ policy ổn định, không phải 'vật nhau' với infrastructure hay đổi."
    }
  }
};

const codeOverrides: Record<string, { naive: string; pattern: string; modern?: string }> = {
  "Single Responsibility Principle": {
    naive: `class JobOrchestrator:
    def handle(self, invoice):
        # 1) BUSINESS POLICY (branching)
        if invoice.type == "A":
            result = self.process_type_a(invoice)
        else:
            result = self.process_type_b(invoice)

        # 2) PERSISTENCE (IO)
        self.repository.save(result)

        # 3) RENDERING (IO)
        pdf = self.renderer.render(result)

        # 4) NOTIFICATION (IO)
        self.notifier.send(pdf)

        # 5) AUDIT (cross-cutting)
        self.audit.log("invoice_sent", invoice_id=result.id)

        # 6) RETRY (control flow + infra concerns)
        # self.retry_policy.run(lambda: self.notifier.send(pdf))

        return pdf`,
    pattern: `from abc import ABC, abstractmethod

class InvoiceRepository(ABC):
    @abstractmethod
    def save(self, invoice): ...

class PdfRenderer(ABC):
    @abstractmethod
    def render(self, invoice): ...

class Notifier(ABC):
    @abstractmethod
    def send(self, payload): ...

class InvoiceService:
    # policy-only: coordinate collaborators
    def __init__(self, repo: InvoiceRepository, renderer: PdfRenderer, notifier: Notifier):
        self.repo = repo
        self.renderer = renderer
        self.notifier = notifier

    def process(self, invoice):
        saved = self.repo.save(invoice)
        pdf = self.renderer.render(saved)
        self.notifier.send(pdf)
        return pdf`,
    modern: `from __future__ import annotations
from dataclasses import dataclass
from typing import Protocol

@dataclass(frozen=True, slots=True)
class Invoice:
    id: str
    type: str
    amount: float

class InvoiceRepository(Protocol):
    def save(self, invoice: Invoice) -> Invoice: ...

class PdfRenderer(Protocol):
    def render(self, invoice: Invoice) -> bytes: ...

class Notifier(Protocol):
    def send(self, payload: bytes) -> None: ...

@dataclass(slots=True)
class InvoiceService:
    repo: InvoiceRepository
    renderer: PdfRenderer
    notifier: Notifier

    def process(self, invoice: Invoice) -> bytes:
        saved = self.repo.save(invoice)
        pdf = self.renderer.render(saved)
        self.notifier.send(pdf)
        return pdf`
  },
  Strategy: {
    naive: `class WorkerService:
    def process(self, job):
        if job.type == "thumb":
            return make_thumbnail(job)
        elif job.type == "classify":
            return classify_image(job)
        elif job.type == "audit":
            return audit_only(job)
        raise ValueError("unsupported job type")`,
    pattern: `from abc import ABC, abstractmethod

class Strategy(ABC):
    @abstractmethod
    def execute(self, job): ...

class ThumbnailStrategy(Strategy):
    def execute(self, job):
        return make_thumbnail(job)

class WorkerContext:
    def __init__(self, strategy: Strategy):
        self.strategy = strategy
    def process(self, job):
        return self.strategy.execute(job)`
  },
  Command: {
    naive: `def run_job(job, queue, logger):
    if job.kind == "thumbnail":
        logger.info("thumb")
        return make_thumbnail(job.payload)
    if job.kind == "classify":
        logger.info("classify")
        return classify(job.payload)
    raise ValueError("unknown job")`,
    pattern: `class Command:
    def execute(self): ...

class ClassifyCommand(Command):
    def __init__(self, receiver, payload):
        self.receiver, self.payload = receiver, payload
    def execute(self):
        return self.receiver.classify(self.payload)

class Dispatcher:
    def submit(self, command: Command):
        return command.execute()`
  },
  Observer: {
    naive: `class Dashboard:
    def refresh(self, shared_state):
        tile_a.color = compute_color(shared_state)
        tile_b.color = compute_color(shared_state)
        tile_c.color = compute_color(shared_state)`,
    pattern: `class ObservableState:
    def __init__(self):
        self._subs = []
    def subscribe(self, obs):
        self._subs.append(obs)
    def set_value(self, value):
        self.value = value
        for obs in self._subs:
            obs.update(value)

class TileObserver:
    def update(self, value):
        self.color = compute_color(value)`
  },
  "Chain of Responsibility": {
    naive: `def process(request):
    if not is_authenticated(request):
        return "401"
    if not is_schema_valid(request):
        return "400"
    if is_high_risk(request):
        return "manual review"
    return "ok"`,
    pattern: `class Handler:
    def __init__(self, nxt=None):
        self.nxt = nxt
    def handle(self, req):
        return self.nxt.handle(req) if self.nxt else "ok"

class AuthHandler(Handler):
    def handle(self, req):
        if not is_authenticated(req):
            return "401"
        return super().handle(req)`
  },
  "Factories (Factory Method and Abstract Factory)": {
    naive: `def create_processor(job_type):
    if job_type == "image":
        return ImageProcessor()
    if job_type == "video":
        return VideoProcessor()
    if job_type == "audio":
        return AudioProcessor()
    raise ValueError("unsupported")`,
    pattern: `class ProcessorFactory:
    @staticmethod
    def create(job_type):
        mapping = {
            "image": ImageProcessor,
            "video": VideoProcessor,
            "audio": AudioProcessor,
        }
        return mapping[job_type]()`
  },
  Builder: {
    naive: `cfg = PipelineConfig()
cfg.batch_size = 16
cfg.retry = 3
cfg.timeout = 30
cfg.write_audit = True
cfg.cache_key = "v1-thumb"
pipeline = Pipeline(cfg)`,
    pattern: `builder = PipelineBuilder()
pipeline = (
    builder
    .batch_size(16)
    .retry(3)
    .timeout(30)
    .audit(True)
    .cache("v1-thumb")
    .build()
)`
  },
  State: {
    naive: `class Job:
    def __init__(self):
        self.status = "queued"
    def run(self):
        if self.status == "queued":
            self.status = "running"
        elif self.status == "running":
            self.status = "done"`,
    pattern: `class State:
    def run(self, ctx): ...

class Queued(State):
    def run(self, ctx):
        ctx.state = Running()

class JobContext:
    def __init__(self):
        self.state = Queued()
    def run(self):
        self.state.run(self)`
  }
};

function difficultyByOrder(order: number): I18nText {
  if (order <= 7) return { en: "Easy", vi: "Dễ" };
  if (order <= 14) return { en: "Intermediate", vi: "Trung bình" };
  if (order <= 21) return { en: "Advanced", vi: "Nâng cao" };
  return { en: "Expert", vi: "Chuyên sâu" };
}

function getScenario(title: string): ScenarioMeta {
  return (
    scenarioMap[title] ?? {
      context: {
        en: "General application architecture",
        vi: "Kiến trúc ứng dụng tổng quát"
      },
      problem: {
        en: `Current code around ${title} is hard to extend safely as features grow.`,
        vi: `Code hiện tại quanh ${title} khó mở rộng an toàn khi feature tăng.`
      },
      analogy: {
        en: "Use the right tool head instead of replacing the entire toolbox.",
        vi: "Dùng đúng đầu công cụ thay vì thay cả hộp công cụ."
      },
      roles: ["Client", "Abstraction", "ImplementationA", "ImplementationB"]
    }
  );
}

function buildPain(problem: I18nText, context: I18nText): I18nList {
  return {
    en: [
      "Change requests often force edits in multiple unrelated files.",
      `In ${context.en}, behavior updates are coupled to concrete implementation choices.`,
      `Because of this, each release around this problem carries high regression risk.`
    ],
    vi: [
      "Mỗi lần đổi yêu cầu đều phải sửa nhiều file không liên quan trực tiếp.",
      `Trong ${context.vi}, thay đổi hành vi đang bị coupling vào implementation concrete.`,
      "Vì vậy, mỗi bản release cho bài toán này đều có rủi ro regression cao."
    ]
  };
}

function buildSolution(title: string, points: string[]): I18nList {
  return {
    en: [
      `Apply ${title} to isolate volatile parts from stable orchestration.`,
      points[0] ?? "Introduce a clear abstraction boundary.",
      "Move change-prone logic behind interfaces and compose via contracts."
    ],
    vi: [
      `Áp dụng ${title} để tách phần thay đổi nhiều khỏi orchestration ổn định.`,
      "Tạo ranh giới abstraction rõ ràng để giảm ảnh hưởng dây chuyền.",
      "Đặt logic hay thay đổi phía sau contract/interface và compose qua contract."
    ]
  };
}

function buildRecognitionCues(title: string, context: I18nText): RecognitionCue[] {
  return [
    {
      cue: {
        en: `When ${title}-related behavior changes, you keep editing a growing conditional chain.`,
        vi: `Mỗi khi hành vi liên quan ${title} đổi, bạn lại phải sửa một chuỗi điều kiện ngày càng dài.`
      },
      code: `def process(item):
    if item.type == "A":
        return handle_a(item)
    elif item.type == "B":
        return handle_b(item)
    # ... add more branches forever
    return handle_default(item)`,
      explanation: {
        en: `In ${context.en}, adding a new case means modifying the existing flow instead of plugging in a new extension point.`,
        vi: `Trong ${context.vi}, thêm case mới đồng nghĩa phải đụng vào flow hiện có thay vì “cắm” thêm một điểm mở rộng.`
      }
    },
    {
      cue: {
        en: "The same branching/wiring logic is duplicated across multiple modules.",
        vi: "Cùng một logic rẽ nhánh/wiring bị lặp lại ở nhiều module."
      },
      code: `# api.py
if kind == "A": ...
elif kind == "B": ...

# worker.py
if kind == "A": ...
elif kind == "B": ...`,
      explanation: {
        en: "A small feature forces edits in several places because there is no stable contract boundary.",
        vi: "Một feature nhỏ buộc sửa nhiều nơi vì không có ranh giới contract ổn định."
      }
    },
    {
      cue: {
        en: "Unit tests need too many collaborators (mocks/fakes) just to reach one behavior.",
        vi: "Unit test cần quá nhiều collaborator (mock/fake) chỉ để chạm được một hành vi."
      },
      code: `def test_service():
    repo = Mock()
    renderer = Mock()
    notifier = Mock()
    audit = Mock()
    retry = Mock()
    svc = Service(repo, renderer, notifier, audit, retry)
    assert svc.run(...) == ...`,
      explanation: {
        en: "If tests are mostly wiring + mocks, you're likely missing clear responsibility boundaries.",
        vi: "Nếu test chủ yếu là dựng wiring + mock, thường là bạn đang thiếu ranh giới trách nhiệm rõ ràng."
      }
    }
  ];
}

function buildCoupling(title: string): ProblemLesson["coupling"] {
  return {
    before: {
      en: `Before ${title}: high coupling between policy and execution path.`,
      vi: `Trước khi dùng ${title}: coupling cao giữa policy và execution path.`
    },
    after: {
      en: `After ${title}: dependencies flow through abstractions, reducing ripple effects.`,
      vi: `Sau khi dùng ${title}: dependency đi qua abstraction, giảm ảnh hưởng dây chuyền.`
    },
    insights: {
      en: [
        "Lower coupling means lower change amplification.",
        "Stable interfaces create safer extension points.",
        "Testing shifts from end-to-end only to focused unit scopes."
      ],
      vi: [
        "Coupling thấp hơn giúp giảm mức độ lan truyền khi thay đổi.",
        "Interface ổn định tạo điểm mở rộng an toàn hơn.",
        "Testing chuyển từ chỉ e2e sang unit test tập trung hơn."
      ]
    }
  };
}

function fallbackNaiveCode(title: string): string {
  return `class AppService:
    def handle(self, item):
        # Naive ${title}: logic mixed in one place
        if item.type == "A":
            return process_a(item)
        if item.type == "B":
            return process_b(item)
        return process_default(item)`;
}

function fallbackPatternCode(title: string, roles: string[]): string {
  const [r0 = "Abstraction", r1 = "Contract", r2 = "ImplementationA"] = roles;
  return `class ${r1}:
    def execute(self, item): ...

class ${r2}(${r1}):
    def execute(self, item):
        return "specialized result"

class ${r0}:
    def __init__(self, impl: ${r1}):
        self.impl = impl
    def handle(self, item):
        return self.impl.execute(item)`;
}

function toPythonIdentifier(value: string, fallback: string): string {
  const stripped = value.replace(/[^a-zA-Z0-9_]/g, "");
  if (!stripped) return fallback;
  if (/^[a-zA-Z_]/.test(stripped)) return stripped;
  return `${fallback}${stripped}`;
}

function fallbackModernCode(title: string, roles: string[]): string {
  const [rawService = "AppService", rawContract = "ExecutionPort", rawImpl = "DefaultExecution"] =
    roles;
  const service = toPythonIdentifier(rawService, "AppService");
  const contract = toPythonIdentifier(rawContract, "ExecutionPort");
  const impl = toPythonIdentifier(rawImpl, "DefaultExecution");
  const eventName = title.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");

  return `from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Protocol

class ${contract}(Protocol):
    def execute(self, payload: dict[str, Any]) -> dict[str, Any]: ...

@dataclass(slots=True)
class ${service}:
    impl: ${contract}
    events: list[str] = field(default_factory=list)

    def handle(self, payload: dict[str, Any]) -> dict[str, Any]:
        result = self.impl.execute(payload)
        self.events.append("${eventName || "pattern"}_processed")
        return result

@dataclass(slots=True)
class ${impl}:
    def execute(self, payload: dict[str, Any]) -> dict[str, Any]:
        return {"ok": True, "payload": payload}`;
}

function buildNaiveCode(title: string): string {
  return codeOverrides[title]?.naive ?? fallbackNaiveCode(title);
}

function buildPatternCode(title: string, roles: string[]): string {
  return codeOverrides[title]?.pattern ?? fallbackPatternCode(title, roles);
}

function buildModernCode(title: string, roles: string[]): string {
  return codeOverrides[title]?.modern ?? fallbackModernCode(title, roles);
}

function buildPatternCodeCommentary(title: string): I18nList {
  return {
    en: [
      `The ${title} implementation isolates orchestration from execution details.`,
      "Dependencies are injected through contracts instead of hardcoded concrete classes.",
      "This structure lowers coupling and enables safer extension without touching policy flow.",
      "Unit tests can target policy and implementation separately with smaller setup."
    ],
    vi: [
      `Implementation ${title} tách orchestration khỏi execution details.`,
      "Dependency được tiêm qua contract thay vì hardcode concrete class.",
      "Cấu trúc này giảm coupling và cho phép mở rộng an toàn hơn mà không sửa policy flow.",
      "Unit test có thể tách riêng policy và implementation với setup nhẹ hơn."
    ]
  };
}

function buildModernCodeCommentary(title: string): I18nList {
  return {
    en: [
      `This ${title} variant uses Python dataclasses to reduce boilerplate and keep dependencies explicit.`,
      "Protocol types document the collaboration contract while remaining implementation-agnostic.",
      "Using `slots=True` improves memory profile and signals intent for lightweight objects."
    ],
    vi: [
      `Biến thể ${title} này dùng dataclass để giảm boilerplate và giữ dependency rõ ràng.`,
      "Protocol mô tả contract cộng tác trong khi vẫn độc lập implementation.",
      "Dùng `slots=True` giúp tối ưu bộ nhớ và thể hiện ý đồ object gọn nhẹ."
    ]
  };
}

function buildUmlStages(title: string, roles: string[]): UmlStage[] {
  const [root = "Abstraction", contract = "Contract", implA = "ImplA", implB = "ImplB"] = roles;

  return [
    {
      title: {
        en: "Stage 1: Naive object graph",
        vi: "Giai đoạn 1: Đồ thị đối tượng naive"
      },
      thinking: {
        en: `Everything related to ${title} is concentrated in one concrete service.`,
        vi: `Mọi thứ liên quan đến ${title} đang dồn vào một service concrete duy nhất.`
      },
      graph: {
        nodes: [
          { id: "client", label: "Client", x: 22, y: 22 },
          { id: "mono", label: "MonolithService", x: 62, y: 58 }
        ],
        edges: [{ from: "client", to: "mono", label: "direct dependency" }]
      }
    },
    {
      title: {
        en: "Stage 2: Extract stable boundary",
        vi: "Giai đoạn 2: Tách ranh giới ổn định"
      },
      thinking: {
        en: "Identify stable orchestration, then pull volatile logic behind a contract.",
        vi: "Nhận diện orchestration ổn định, sau đó đưa logic hay đổi vào sau contract."
      },
      graph: {
        nodes: [
          { id: "client", label: "Client", x: 15, y: 26 },
          { id: "root", label: root, x: 50, y: 26 },
          { id: "contract", label: contract, x: 50, y: 70 }
        ],
        edges: [
          { from: "client", to: "root" },
          { from: "root", to: "contract", label: "depends on" }
        ]
      }
    },
    {
      title: {
        en: "Stage 3: Pattern-ready architecture",
        vi: "Giai đoạn 3: Kiến trúc hoàn chỉnh theo pattern"
      },
      thinking: {
        en: "Add interchangeable implementations while keeping client dependencies stable.",
        vi: "Thêm implementation có thể hoán đổi trong khi giữ dependency của client ổn định."
      },
      graph: {
        nodes: [
          { id: "client", label: "Client", x: 12, y: 18 },
          { id: "root", label: root, x: 40, y: 18 },
          { id: "contract", label: contract, x: 70, y: 18 },
          { id: "implA", label: implA, x: 56, y: 72 },
          { id: "implB", label: implB, x: 84, y: 72 }
        ],
        edges: [
          { from: "client", to: "root" },
          { from: "root", to: "contract" },
          { from: "implA", to: "contract", label: "implements" },
          { from: "implB", to: "contract", label: "implements" }
        ]
      }
    }
  ];
}

function buildComparison(title: string): ComparisonRow[] {
  return [
    {
      aspect: { en: "Change Cost", vi: "Chi phí thay đổi" },
      noPattern: {
        en: "Feature updates trigger broad edits.",
        vi: "Cập nhật feature dẫn đến sửa rộng."
      },
      withPattern: {
        en: `${title} narrows edits to extension points.`,
        vi: `${title} giới hạn sửa đổi vào điểm mở rộng.`
      }
    },
    {
      aspect: { en: "Coupling", vi: "Độ coupling" },
      noPattern: {
        en: "Direct concrete dependencies spread quickly.",
        vi: "Dependency concrete trực tiếp lan nhanh."
      },
      withPattern: {
        en: "Dependencies move toward abstractions/contracts.",
        vi: "Dependency chuyển dần sang abstraction/contract."
      }
    },
    {
      aspect: { en: "Testability", vi: "Khả năng test" },
      noPattern: {
        en: "Tests require heavy setup and many collaborators.",
        vi: "Test cần setup nặng và nhiều collaborator."
      },
      withPattern: {
        en: "Components can be unit-tested in isolation.",
        vi: "Thành phần có thể unit-test độc lập."
      }
    },
    {
      aspect: { en: "Runtime Flexibility", vi: "Độ linh hoạt runtime" },
      noPattern: {
        en: "Behavior changes usually require code edits and redeploy.",
        vi: "Đổi hành vi thường cần sửa code và deploy lại."
      },
      withPattern: {
        en: "Behavior can often be swapped by composition or configuration.",
        vi: "Hành vi thường có thể hoán đổi qua composition hoặc config."
      }
    }
  ];
}

function splitBusinessProblemTitle(value: I18nText): { team: I18nText; problemLabel: I18nText } {
  const [teamEn, problemEn] = value.en.split(":");
  const [teamVi, problemVi] = value.vi.split(":");
  return {
    team: {
      en: teamEn?.trim() ?? value.en,
      vi: teamVi?.trim() ?? value.vi
    },
    problemLabel: {
      en: (problemEn ?? value.en).trim(),
      vi: (problemVi ?? value.vi).trim()
    }
  };
}

function buildArchitecturalGoal(sectionTitle: string, patternTitle: string): I18nText {
  const goals: Record<string, I18nText> = {
    "SOLID Design Principles": {
      en: "Stabilize policy boundaries, isolate volatility, and reduce change amplification.",
      vi: "Ổn định ranh giới policy, tách volatility, và giảm change amplification."
    },
    "Creational Design Patterns": {
      en: "Make object construction predictable while keeping orchestration logic clean.",
      vi: "Làm cho khởi tạo đối tượng dự đoán được trong khi giữ orchestration sạch."
    },
    "Structural Design Patterns": {
      en: "Control integration and extension points without breaking existing contracts.",
      vi: "Kiểm soát điểm tích hợp và mở rộng mà không vỡ contract hiện có."
    },
    "Behavioral Design Patterns": {
      en: "Formalize runtime interactions so behavior evolves safely.",
      vi: "Chính thức hoá tương tác runtime để hành vi có thể tiến hoá an toàn."
    }
  };

  const sectionGoal =
    goals[sectionTitle] ?? {
      en: "Isolate volatility and improve long-term evolvability.",
      vi: "Tách volatility và tăng khả năng tiến hoá dài hạn."
    };

  return {
    en: `${sectionGoal.en} ${patternTitle} is used to enforce this boundary.`,
    vi: `${sectionGoal.vi} ${patternTitle} được dùng để ép buộc ranh giới này.`
  };
}

function buildProblemNarrative(
  title: string,
  context: I18nText,
  problem: I18nText
): I18nList {
  return {
    en: [
      `In VisionOps, the ${title} concern surfaced inside ${context.en}.`,
      "The original implementation optimized short-term speed by concentrating behavior in one place.",
      problem.en,
      "What looked convenient initially became an architectural bottleneck as the product scaled."
    ],
    vi: [
      `Trong VisionOps, vấn đề ${title} xuất hiện trong ${context.vi}.`,
      "Implementation ban đầu tối ưu tốc độ ngắn hạn bằng cách dồn hành vi vào một điểm.",
      problem.vi,
      "Sự tiện lợi ban đầu dần trở thành nút thắt kiến trúc khi sản phẩm mở rộng."
    ]
  };
}

function buildPainBlocks(title: string, context: I18nText): ProblemLesson["painBlocks"] {
  return [
    {
      heading: {
        en: "1. Change Amplification",
        vi: "1. Change Amplification"
      },
      details: {
        en: [
          `A small ${title}-related request in ${context.en} now touches unrelated modules.`,
          "Code reviews become broader and slower.",
          "Regression probability increases release-over-release."
        ],
        vi: [
          `Một yêu cầu nhỏ liên quan ${title} trong ${context.vi} nay chạm vào module không liên quan.`,
          "Code review rộng hơn và chậm hơn.",
          "Xác suất regression tăng theo từng release."
        ]
      }
    },
    {
      heading: {
        en: "2. Behavioral Coupling",
        vi: "2. Behavioral Coupling"
      },
      details: {
        en: [
          "Domain policy is entangled with concrete infrastructure choices.",
          "Swapping one implementation requires policy-level edits.",
          "Substitution safety is low."
        ],
        vi: [
          "Domain policy bị đan xen với lựa chọn infrastructure concrete.",
          "Hoán đổi một implementation buộc phải sửa policy-level.",
          "Độ an toàn khi thay thế thấp."
        ]
      }
    },
    {
      heading: {
        en: "3. Testing Friction",
        vi: "3. Testing Friction"
      },
      details: {
        en: [
          "Unit tests require too many collaborators to instantiate.",
          "Mock setup dominates test readability.",
          "Fast feedback loops degrade."
        ],
        vi: [
          "Unit test cần quá nhiều collaborator để khởi tạo.",
          "Mock setup chiếm phần lớn độ đọc của test.",
          "Vòng phản hồi nhanh bị suy giảm."
        ]
      }
    },
    {
      heading: {
        en: "4. Team Cognitive Load",
        vi: "4. Team Cognitive Load"
      },
      details: {
        en: [
          "New engineers struggle to find safe change boundaries.",
          "Ownership lines blur across teams.",
          "Velocity slows as risk management overhead grows."
        ],
        vi: [
          "Kỹ sư mới khó tìm ranh giới thay đổi an toàn.",
          "Ranh giới sở hữu giữa các team bị mờ.",
          "Tốc độ phát triển chậm lại khi chi phí quản lý rủi ro tăng."
        ]
      }
    }
  ];
}

function buildCouplingDiagramBefore(roles: string[]): string {
  const [root = "Orchestrator", dep1 = "DependencyA", dep2 = "DependencyB", dep3 = "DependencyC"] =
    roles;
  return `${root}
 ├── ${dep1}
 ├── ${dep2}
 └── ${dep3}`;
}

function buildCouplingDiagramAfter(roles: string[]): string {
  const [root = "Service", dep1 = "ContractA", dep2 = "ConcreteA", dep3 = "ConcreteB"] = roles;
  return `${root} (policy)
    ↓
Interfaces
    ↓
${dep1} → ${dep2}, ${dep3}`;
}

function buildStrategicOutcome(title: string): I18nList {
  return {
    en: [
      `Core ${title}-related orchestration becomes stable.`,
      "Infrastructure can evolve independently.",
      "Testing scope shrinks to focused units.",
      "Change risk decreases and delivery throughput improves."
    ],
    vi: [
      `Orchestration liên quan ${title} trở nên ổn định hơn.`,
      "Infrastructure có thể tiến hoá độc lập.",
      "Phạm vi test thu hẹp về các unit tập trung.",
      "Rủi ro thay đổi giảm và thông lượng giao hàng tăng."
    ]
  };
}

function buildCoreInsight(title: string): I18nText {
  return {
    en: `${title} is not only a coding style; it is an architecture boundary tool for isolating volatility and protecting stable policy.`,
    vi: `${title} không chỉ là coding style; đó là công cụ đặt ranh giới kiến trúc để tách volatility và bảo vệ policy ổn định.`
  };
}

const businessProblemTitles: Record<string, I18nText> = {
  "Single Responsibility Principle": {
    en: "VisionOps Core Team: Rescue JobOrchestrator from 'Do-It-All' Syndrome",
    vi: "VisionOps Core Team: Giải cứu JobOrchestrator khỏi hội chứng 'ôm đồm'"
  },
  "Open-Closed Principle": {
    en: "VisionOps Experiment Team: Add New Screening Rules Without Editing Core Flow",
    vi: "VisionOps Experiment Team: Thêm rule screening mới mà không sửa luồng core"
  },
  "Liskov Substitution Principle": {
    en: "VisionOps Storage Team: Swap Storage Providers Without Breaking Workers",
    vi: "VisionOps Storage Team: Hoán đổi storage provider mà không vỡ worker"
  },
  "Interface Segregation Principle": {
    en: "VisionOps Device Team: Split a Giant Device API into Focused Contracts",
    vi: "VisionOps Device Team: Tách API thiết bị lớn thành contract nhỏ"
  },
  "Dependency Inversion Principle": {
    en: "VisionOps Platform Team: Decouple Notification Service from Vendor SDKs",
    vi: "VisionOps Platform Team: Tách Notification Service khỏi vendor SDK"
  },
  Builder: {
    en: "VisionOps Pipeline Team: Assemble Complex Pipeline Config Safely",
    vi: "VisionOps Pipeline Team: Lắp ráp config pipeline phức tạp an toàn"
  },
  "Factories (Factory Method and Abstract Factory)": {
    en: "VisionOps Runtime Team: Create Processor Families by Job Type",
    vi: "VisionOps Runtime Team: Tạo họ processor theo job type"
  },
  Prototype: {
    en: "VisionOps ML Team: Clone Baseline Model Profiles for New Experiments",
    vi: "VisionOps ML Team: Clone profile model mẫu cho thí nghiệm mới"
  },
  Singleton: {
    en: "VisionOps Infra Team: Keep a Single Runtime Configuration Source",
    vi: "VisionOps Infra Team: Giữ một nguồn runtime config duy nhất"
  },
  Adapter: {
    en: "VisionOps Integration Team: Connect Legacy OCR API to New Contracts",
    vi: "VisionOps Integration Team: Nối API OCR cũ vào contract mới"
  },
  Bridge: {
    en: "VisionOps Compute Team: Support CPU/GPU Backends Under One Abstraction",
    vi: "VisionOps Compute Team: Hỗ trợ CPU/GPU backend dưới một abstraction"
  },
  Composite: {
    en: "VisionOps Batch Team: Treat Single Job and Job Group Uniformly",
    vi: "VisionOps Batch Team: Xử lý job đơn và job group đồng nhất"
  },
  Decorator: {
    en: "VisionOps Reliability Team: Add Retry and Logging Without Touching Core Processors",
    vi: "VisionOps Reliability Team: Thêm retry và logging mà không sửa core processor"
  },
  Facade: {
    en: "VisionOps API Team: Expose One Entry Point for Multi-step Recognition Flow",
    vi: "VisionOps API Team: Mở một entry point cho recognition flow nhiều bước"
  },
  Flyweight: {
    en: "VisionOps Optimization Team: Reduce Memory for Massive Detection Metadata",
    vi: "VisionOps Optimization Team: Giảm bộ nhớ cho detection metadata số lượng lớn"
  },
  Proxy: {
    en: "VisionOps Serving Team: Defer Heavy Model Initialization",
    vi: "VisionOps Serving Team: Trì hoãn khởi tạo model nặng"
  },
  "Chain of Responsibility": {
    en: "VisionOps Validation Team: Route Requests Through Ordered Guards",
    vi: "VisionOps Validation Team: Chuyển request qua chuỗi guard có thứ tự"
  },
  Command: {
    en: "VisionOps Queue Team: Encapsulate Worker Actions as Queueable Commands",
    vi: "VisionOps Queue Team: Đóng gói worker action thành command có thể queue"
  },
  Interpreter: {
    en: "VisionOps Query Team: Parse Rule Expressions from User Input",
    vi: "VisionOps Query Team: Parse rule expression từ user input"
  },
  Iterator: {
    en: "VisionOps Media Team: Standardize Traversal Across Frame Collections",
    vi: "VisionOps Media Team: Chuẩn hoá cách duyệt frame collections"
  },
  Mediator: {
    en: "VisionOps Control Plane Team: Coordinate UI Panels and Workers Centrally",
    vi: "VisionOps Control Plane Team: Điều phối panel UI và worker tập trung"
  },
  Memento: {
    en: "VisionOps Tuning Team: Provide Undo/Redo for Parameter Changes",
    vi: "VisionOps Tuning Team: Cung cấp undo/redo cho thay đổi tham số"
  },
  Observer: {
    en: "VisionOps Dashboard Team: Push Shared State Updates to Tiles",
    vi: "VisionOps Dashboard Team: Đẩy cập nhật state dùng chung đến các tile"
  },
  State: {
    en: "VisionOps Lifecycle Team: Formalize Job State Transitions",
    vi: "VisionOps Lifecycle Team: Chính thức hoá transition state của job"
  },
  Strategy: {
    en: "VisionOps Worker Team: Swap Processing Algorithms per Worker Type",
    vi: "VisionOps Worker Team: Hoán đổi thuật toán theo từng worker type"
  },
  Template: {
    en: "VisionOps Pipeline Template Team: Reuse Skeleton with Specialized Hooks",
    vi: "VisionOps Pipeline Template Team: Tái sử dụng skeleton với hook chuyên biệt"
  },
  Visitor: {
    en: "VisionOps Analytics Team: Add New Reports Without Editing Node Classes",
    vi: "VisionOps Analytics Team: Thêm báo cáo mới mà không sửa node class"
  }
};

function getBusinessProblemTitle(title: string, context: I18nText): I18nText {
  return (
    businessProblemTitles[title] ?? {
      en: `VisionOps Program: Solve ${context.en}`,
      vi: `VisionOps Program: Giải quyết ${context.vi}`
    }
  );
}

function buildLessons(): ProblemLesson[] {
  let order = 0;

  return sections.flatMap((section) =>
    section.items.map((item) => {
      order += 1;
      const scenario = getScenario(item.title);
      const sectionLabel = sectionLabelMap[section.title] ?? {
        en: section.title,
        vi: section.title
      };
      const businessProblem = getBusinessProblemTitle(item.title, scenario.context);
      const split = splitBusinessProblemTitle(businessProblem);
      const baseLesson: ProblemLesson = {
        id: slugify(item.title),
        order,
        businessProblem,
        team: split.team,
        problemLabel: split.problemLabel,
        section: sectionLabel,
        title: item.title,
        difficulty: difficultyByOrder(order),
        context: scenario.context,
        architecturalGoal: buildArchitecturalGoal(section.title, item.title),
        problem: scenario.problem,
        problemNarrative: buildProblemNarrative(item.title, scenario.context, scenario.problem),
        pain: buildPain(scenario.problem, scenario.context),
        painBlocks: buildPainBlocks(item.title, scenario.context),
        solution: buildSolution(item.title, item.points),
        recognitionCues: buildRecognitionCues(item.title, scenario.context),
        coupling: buildCoupling(item.title),
        couplingDiagramBefore: buildCouplingDiagramBefore(scenario.roles),
        couplingDiagramAfter: buildCouplingDiagramAfter(scenario.roles),
        naiveCode: buildNaiveCode(item.title),
        patternCode: buildPatternCode(item.title, scenario.roles),
        modernCode: buildModernCode(item.title, scenario.roles),
        patternCodeCommentary: buildPatternCodeCommentary(item.title),
        modernCodeCommentary: buildModernCodeCommentary(item.title),
        umlStages: buildUmlStages(item.title, scenario.roles),
        comparison: buildComparison(item.title),
        analogy: scenario.analogy,
        strategicOutcome: buildStrategicOutcome(item.title),
        coreInsight: buildCoreInsight(item.title)
      };

      const override = lessonOverrides[item.title];
      return override ? { ...baseLesson, ...override } : baseLesson;
    })
  );
}

export const problemLessons = buildLessons();

export const deckText: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    intro: string;
    navTitle: string;
    close: string;
    problem: string;
    pain: string;
    solution: string;
    recognition: string;
    coupling: string;
    before: string;
    after: string;
    insights: string;
    naive: string;
    refactor: string;
    modern: string;
    uml: string;
    comparison: string;
    analogy: string;
    section: string;
    difficulty: string;
    context: string;
    journey: string;
    trigger: string;
    stakes: string;
    couplingGoal: string;
    codeWalkthrough: string;
    previousProblem: string;
    nextProblem: string;
  }
> = {
  en: {
    title: "Pattern Learning Deck",
    subtitle: "From easy to hard, strictly following the README order",
    intro:
      "Each lesson is problem-first: Problem -> Pain -> Solution, then recognition, coupling lens, naive vs refactor, UML evolution, and analogy.",
    navTitle: "Problem Navigation",
    close: "Close",
    problem: "Problem",
    pain: "Pain",
    solution: "Solution",
    recognition: "How to recognize when you need this pattern",
    coupling: "Coupling analysis",
    before: "Before",
    after: "After",
    insights: "Coupling insights",
    naive: "Naive version",
    refactor: "Refactor with pattern",
    modern: "Modern Python (dataclass)",
    uml: "UML evolution and thinking stages",
    comparison: "Pattern vs no pattern",
    analogy: "Real-life analogy",
    section: "Section",
    difficulty: "Difficulty",
    context: "Context",
    journey: "Story journey",
    trigger: "Trigger event",
    stakes: "Engineering stakes",
    couplingGoal: "Coupling target",
    codeWalkthrough: "Open local code walkthrough",
    previousProblem: "Previous problem",
    nextProblem: "Next problem"
  },
  vi: {
    title: "Bộ slide học Pattern",
    subtitle: "Đi từ dễ đến khó, đúng thứ tự README gốc",
    intro:
      "Mỗi bài học đều theo hướng problem-first: Problem -> Pain -> Solution, sau đó đến nhận diện, coupling lens, naive vs refactor, UML evolution và analogy.",
    navTitle: "Điều hướng theo bài toán",
    close: "Đóng",
    problem: "Problem",
    pain: "Pain",
    solution: "Solution",
    recognition: "Cách nhận diện khi bạn cần pattern này",
    coupling: "Phân tích coupling",
    before: "Trước",
    after: "Sau",
    insights: "Nhận xét coupling",
    naive: "Phiên bản naive",
    refactor: "Refactor bằng pattern",
    modern: "Phiên bản Python hiện đại (dataclass)",
    uml: "Tiến trình UML và tư duy thiết kế",
    comparison: "So sánh có pattern vs không pattern",
    analogy: "Liên tưởng đời sống",
    section: "Nhóm",
    difficulty: "Độ khó",
    context: "Bối cảnh",
    journey: "Hành trình câu chuyện",
    trigger: "Sự kiện kích hoạt",
    stakes: "Mức độ ảnh hưởng kỹ thuật",
    couplingGoal: "Mục tiêu coupling",
    codeWalkthrough: "Mở walkthrough code local",
    previousProblem: "Bài toán trước",
    nextProblem: "Bài toán tiếp theo"
  }
};

export function pickText(text: I18nText, lang: Lang): string {
  return text[lang];
}

export function pickList(list: I18nList, lang: Lang): string[] {
  return list[lang];
}
