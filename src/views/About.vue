<template>
  <div class="with-nav page-container about-page">
    <section class="hero">
      <div class="hero-grid">
        <div>
          <p class="hero-kicker">Writer's Nook • Progress Report</p>
          <h1>О проекте и моем прогрессе во Vue</h1>
          <p class="hero-text">
            Я перешел с React на Vue и использую этот проект как практическую
            площадку: от UI и форм до маршрутизации, архитектуры и Firestore.
          </p>

          <div class="hero-tags">
            <span class="tag">Vue 3</span>
            <span class="tag">Pinia</span>
            <span class="tag">Vuetify</span>
            <span class="tag">Firebase / Firestore</span>
            <span class="tag">TypeScript</span>
          </div>
        </div>

        <aside class="hero-sketch">
          <article class="sketch-card">
            <div class="sketch-icon">
              <AppIcon icon="PenIcon" :size="20" />
            </div>
            <div>
              <h3>Переход React -> Vue</h3>
              <p>Осознанный переход на Composition API и экосистему Vue.</p>
            </div>
          </article>

          <article class="sketch-card">
            <div class="sketch-icon">
              <AppIcon icon="BookIcon" :size="20" />
            </div>
            <div>
              <h3>Проект как продукт</h3>
              <p>
                Не учебный hello-world: реальные фичи, данные, формы и сценарии
                пользователя.
              </p>
            </div>
          </article>
        </aside>
      </div>
    </section>

    <section class="card">
      <h2>Контекст и цель</h2>
      <p>
        Проект объединяет библиотеку, заметки и мастерскую писателя в одном
        приложении. Цель: не только изучить синтаксис Vue, но и научиться
        выстраивать модульную frontend-архитектуру с состоянием, формами,
        роутингом и backend-интеграцией.
      </p>
    </section>

    <section class="card accent">
      <h2>Что уже реализовано</h2>
      <div class="feature-grid">
        <article
          v-for="feature in features"
          :key="feature.title"
          class="feature-item"
        >
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.summary }}</p>
          <ul>
            <li v-for="point in feature.points" :key="point">{{ point }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="card">
      <h2>Архитектура, которую я применил</h2>
      <div class="architecture-grid">
        <article
          v-for="layer in architecture"
          :key="layer.title"
          class="architecture-item"
        >
          <h3>{{ layer.title }}</h3>
          <p>{{ layer.description }}</p>
        </article>
      </div>
    </section>

    <section class="card ui-kit-card">
      <h2>UI-kit эксперименты (AppIcon / AppAlert)</h2>
      <p>
        Я вынес общие примитивы в `components/ui`: отдельный компонент иконок и
        централизованный алерт. Это помогло сделать интерфейс единообразнее и
        упростило повторное использование.
      </p>

      <div class="ui-kit-grid">
        <div class="icon-palette">
          <h3>Палитра иконок</h3>
          <div class="icon-cloud">
            <div
              v-for="item in iconPalette"
              :key="item.label"
              class="icon-chip"
            >
              <span class="icon-bubble" :class="item.tone">
                <AppIcon :icon="item.icon" :size="18" />
              </span>
              <span class="icon-label">{{ item.label }}</span>
            </div>
          </div>
        </div>

        <div class="alert-examples">
          <h3>Паттерн алертов</h3>
          <div class="alert-mock success">
            <div class="alert-left">
              <AppIcon icon="SuccessIcon" :size="20" />
              <span>Изменения успешно сохранены</span>
            </div>
            <AppIcon icon="XIcon" :size="18" />
          </div>
          <div class="alert-mock danger">
            <div class="alert-left">
              <AppIcon icon="DangerIcon" :size="20" />
              <span>Не удалось загрузить данные</span>
            </div>
            <AppIcon icon="XIcon" :size="18" />
          </div>
        </div>
      </div>
    </section>

    <section class="card">
      <h2>Чему я научился во Vue (после React)</h2>
      <ul class="learning-list">
        <li v-for="item in learning" :key="item">{{ item }}</li>
      </ul>
    </section>

    <section class="card">
      <h2>Технологии и библиотеки</h2>
      <div class="stack">
        <span v-for="item in stack" :key="item" class="stack-chip">
          {{ item }}
        </span>
      </div>
    </section>

    <section class="card ai-work-card">
      <h2>Свободная работа с ИИшкой</h2>
      <p>
        В этом спринте я осознанно работаю с Codex как с инженерным напарником:
        не просто "сгенерируй код", а по шагам формулировал цель, ограничения
        Firestore и ожидаемый UX. Для теста оставил жесткое правило удаления на
        общих проектах на стороне firestore.
      </p>

      <div class="ai-grid">
        <article class="ai-item" v-for="item in aiPractice" :key="item.title">
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>

    <section class="card">
      <h2>Следующие шаги</h2>
      <ul>
        <li>
          Ужесточить типизацию Firestore-слоя и постепенно убрать слабые места с
          `any`.
        </li>
        <li>
          Продолжить развитие UI-kit: унифицировать карточки, пустые состояния и
          уведомления.
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import AppIcon from "../components/ui/AppIcon.vue";

defineOptions({
  name: "About",
});

const features = [
  {
    title: "Библиотека",
    summary: "CRUD для книг с хранением статуса чтения, рейтинга и метаданных.",
    points: [
      "Добавление, редактирование и удаление книг через Firestore REST API",
      "Фильтрация и поиск в библиотеке",
      "Работа с обложками, жанрами, рейтингом и статусом чтения",
    ],
  },
  {
    title: "Заметки",
    summary: "Два типа заметок: общие и привязанные к конкретной книге.",
    points: [
      "Отдельный модуль обычных заметок пользователя",
      "Подколлекция заметок внутри книги (`/books/{bookId}/notes`)",
      "Маршруты создания/редактирования и загрузка заметки по id",
    ],
  },
  {
    title: "Мастерская проектов",
    summary:
      "Редактор писательских проектов с иерархической структурой контента.",
    points: [
      "Дерево узлов: `book -> volume -> chapter -> scene -> leaf`",
      "Валидация допустимых дочерних узлов и рекурсивный поиск/обновление",
      "Публикация в общую и личную публичную коллекции",
    ],
  },
  {
    title: "Публичная витрина",
    summary: "Лента публикаций с карточками и предпросмотром проектов.",
    points: [
      "Главная страница с поиском по названию, автору и жанру",
      "Карточки с жанровыми тегами, типом и превью",
      "Парсинг дополнительных полей из Firestore (`author/year/genre`)",
    ],
  },
  {
    title: "Профиль и авторизация",
    summary:
      "Полный аккаунт-поток: регистрация, вход, хранение сессии, профиль.",
    points: [
      "Firebase Identity Toolkit для sign up/sign in",
      "Сохранение токена и данных пользователя в localStorage",
      "Route guard + axios interceptor для 401 и автоматического logout",
    ],
  },
];

const architecture = [
  {
    title: "UI слой (Views + Components)",
    description:
      "Экранные компоненты в `views`, переиспользуемые карточки/модалки/формы в `components`.",
  },
  {
    title: "State слой (Pinia Stores)",
    description:
      "Изолированные доменные сторы: `auth`, `books`, `notes`, `bookNotes`, `projects`, `profile`.",
  },
  {
    title: "Form слой (Composables)",
    description: "Переиспользуемые composables форм на `vee-validate + zod`.",
  },
  {
    title: "Data слой (Axios + Firestore)",
    description:
      "Единый axios-клиент, interceptor'ы, работа с Firestore REST и конвертеры Firestore <-> доменная модель.",
  },
  {
    title: "Routing и Layouts",
    description:
      "Meta-layout подход (`main`/`auth`) и route guard для контроля доступа.",
  },
];

const learning = [
  "Понял разницу ментальной модели React и Vue: `ref/computed/watch` вместо привычных hooks.",
  "Освоил Composition API и `script setup`: `defineProps`, `defineEmits`, композиция логики.",
  "Научился декомпозировать приложение по доменным сторам в Pinia.",
  "На практике разобрался с сериализацией/десериализацией сложных структур в Firestore.",
  "Поработал с Vuetify-компонентами и настройкой общей визуальной системы.",
  "Стал увереннее в маршрутизации, guard-логике и обработке ошибок API.",
];

const aiPractice = [
  {
    title: "Осознанная постановка задачи",
    text: "Сформулировал сценарий удаления через emit из карточки, confirm-диалог и удаление связанной пары публикаций.",
  },
  {
    title: "Реализация в интерфейсе",
    text: "В Workshop добавлен поток: hover-иконка удаления -> emit -> AppConfirm -> вызов нужного метода стора.",
  },
  {
    title: "Firestore-часть без магии",
    text: "Разделили удаление на личную и глобальную публикации, добавили fallback при PERMISSION_DENIED и понятный пользовательский алерт.",
  },
  {
    title: "Итог сотрудничества",
    text: "Удаление опубликованного проекта работает надежнее, а я лучше понимаю, как общаться с Codex как с инструментом: задавать контекст, проверять ограничения и доводить фичу до конца.",
  },
];

const stack = [
  "Vue 3 (Composition API)",
  "TypeScript",
  "Pinia",
  "Vue Router",
  "Vuetify",
  "Vee-Validate",
  "Zod",
  "Axios",
  "Firebase Auth (REST)",
  "Cloud Firestore (REST)",
  "Day.js",
];

const iconPalette = [
  { icon: "BookIcon", label: "BookIcon", tone: "tone-1" },
  { icon: "PenIcon", label: "PenIcon", tone: "tone-2" },
  { icon: "SuccessIcon", label: "SuccessIcon", tone: "tone-3" },
  { icon: "DangerIcon", label: "DangerIcon", tone: "tone-4" },
  { icon: "StarSolidIcon", label: "StarSolidIcon", tone: "tone-5" },
  { icon: "EyeIcon", label: "EyeIcon", tone: "tone-6" },
] as const;
</script>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 28px;
}

.hero {
  border: 1px solid #eddcc5;
  border-radius: 24px;
  padding: 24px;
  background:
    radial-gradient(
      circle at 20% 15%,
      rgba(255, 214, 170, 0.55) 0,
      transparent 35%
    ),
    radial-gradient(
      circle at 85% 20%,
      rgba(193, 217, 255, 0.55) 0,
      transparent 32%
    ),
    linear-gradient(135deg, #fff8ef 0%, #fdf1e2 45%, #f4f7ff 100%);
  box-shadow: 0 14px 32px rgba(187, 145, 94, 0.14);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 16px;
}

.hero-kicker {
  margin: 0 0 8px;
  color: #9a5f2e;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.82rem;
}

h1 {
  margin: 0 0 12px;
  font-size: 2rem;
  line-height: 1.2;
  color: #2f2a25;
}

h2 {
  margin: 0 0 12px;
  color: #2f2a25;
}

h3 {
  margin: 0 0 8px;
  color: #3f352d;
}

p {
  margin: 0;
  line-height: 1.6;
}

ul {
  margin: 10px 0 0;
  padding-left: 20px;
}

li {
  margin-bottom: 6px;
}

.hero-text {
  color: #4c3f34;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.tag {
  border: 1px solid #dbbc96;
  background: #fff7ee;
  color: #744a28;
  font-weight: 600;
  border-radius: 999px;
  padding: 6px 11px;
  font-size: 0.85rem;
}

.hero-sketch {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sketch-card {
  border: 1px dashed #cda178;
  background: rgba(255, 255, 255, 0.78);
  border-radius: 14px;
  padding: 12px;
  display: flex;
  gap: 10px;
}

.sketch-icon {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #e8d2b8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card {
  background: #fffefc;
  border: 1px solid #efdfca;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(164, 120, 72, 0.08);
}

.accent {
  background: linear-gradient(180deg, #fffaf4 0%, #fffefb 100%);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.feature-item {
  border: 1px solid #efdccc;
  border-radius: 14px;
  padding: 14px;
  background: #fffdf9;
}

.feature-item:nth-child(3n + 1) {
  background: linear-gradient(180deg, #fff6ec 0%, #fffdf8 100%);
}

.feature-item:nth-child(3n + 2) {
  background: linear-gradient(180deg, #f2f8ff 0%, #fcfeff 100%);
}

.feature-item:nth-child(3n + 3) {
  background: linear-gradient(180deg, #f7f4ff 0%, #fefcff 100%);
}

.architecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.architecture-item {
  border: 1px solid #efe5d8;
  border-radius: 14px;
  padding: 14px;
  background: #fffcf8;
}

.ui-kit-card {
  background:
    radial-gradient(
      circle at 92% 10%,
      rgba(170, 211, 255, 0.26) 0,
      transparent 25%
    ),
    radial-gradient(
      circle at 5% 90%,
      rgba(255, 203, 170, 0.23) 0,
      transparent 25%
    ),
    linear-gradient(180deg, #f7fcff 0%, #fff 100%);
  border-color: #d0e3f4;
}

.ui-kit-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.icon-palette,
.alert-examples {
  border: 1px solid #d6e5f3;
  border-radius: 14px;
  padding: 12px;
  background: #ffffffde;
}

.icon-cloud {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 8px;
}

.icon-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e6eef6;
  border-radius: 999px;
  padding: 6px 10px 6px 6px;
  background: #fff;
}

.icon-bubble {
  width: 30px;
  height: 30px;
  border-radius: 999px;
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-label {
  font-size: 0.86rem;
  color: #385573;
  font-weight: 600;
}

.tone-1 {
  background: #fff2e1;
  border-color: #f2c998;
}

.tone-2 {
  background: #f7ebff;
  border-color: #dab7f4;
}

.tone-3 {
  background: #eaf8ef;
  border-color: #b8e0c3;
}

.tone-4 {
  background: #ffefef;
  border-color: #efc2c2;
}

.tone-5 {
  background: #fff9e5;
  border-color: #edd89a;
}

.tone-6 {
  background: #ebf4ff;
  border-color: #bcd5f4;
}

.alert-mock {
  margin-top: 8px;
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid;
}

.alert-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.alert-mock.success {
  background: #eefaf1;
  border-color: #bfe7c9;
  color: #276338;
}

.alert-mock.danger {
  background: #fff2f2;
  border-color: #f0c7c7;
  color: #8a2a2a;
}

.learning-list {
  margin: 0;
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.stack-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #d9c2a1;
  background: linear-gradient(180deg, #fff7ed 0%, #fffdf7 100%);
  color: #734d2e;
  font-size: 0.9rem;
  font-weight: 600;
}

.ai-work-card {
  background:
    radial-gradient(
      circle at 95% 8%,
      rgba(255, 204, 169, 0.25) 0,
      transparent 24%
    ),
    linear-gradient(180deg, #fffdfa 0%, #fff 100%);
}

.ai-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
}

.ai-item {
  border: 1px solid #ebdcc8;
  border-radius: 14px;
  padding: 14px;
  background: #fff;
}

@media (max-width: 920px) {
  .hero-grid,
  .ui-kit-grid {
    grid-template-columns: 1fr;
  }
}
</style>
