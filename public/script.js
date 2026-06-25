const jobsContainer = document.querySelector(".jobs");
const form = document.querySelector(".form");
const fileInput = document.querySelector('input[type="file"]');
const selectedFile = document.querySelector('.selected-file');

const baseUrl = "http://localhost:8000/videos"

const STATUS = {
    0: "Na fila",
    1: "Transcrevendo áudio",
    2: "Incorporando legendas",
    3: "Concluído"
};

const socket = io();
const jobs = new Map();

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fileInput = form.querySelector('[type="file"]');

    if (!fileInput.files.length) {
        return;
    }

    const file = fileInput.files[0];

    const formData = new FormData();

    formData.append("video", file);

    formData.append(
        "language",
        form.querySelector("select").value
    );

    formData.append(
        "translate",
        form.querySelector('[type="checkbox"]').checked
    );

    formData.append(
        "prompt",
        form.querySelector("textarea").value
    );

    const response = await fetch(`${baseUrl}/upload`, {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    createJob({
        jobId: data.jobId,
        filename: file.name
    });
});



fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    selectedFile.textContent = file
        ? file.name
        : "";
});

function createJob({ jobId, filename }) {

    const element = document.createElement("div");

    element.className = "job";

    element.innerHTML = `
        <div class="job-info">

            <span class="filename">
                ${filename}
            </span>

            <span class="status">
                Na fila
                <span class="dots"></span>
            </span>

        </div>

        <button
            class="save-btn"
            disabled
        >
            Salvar
        </button>
    `;

    jobsContainer.prepend(element);

    jobs.set(jobId, {
        filename,
        element,
        saveButton: element.querySelector(".save-btn"),
        statusElement: element.querySelector(".status")
    });
}

async function downloadResult(jobId) {
    const response = await fetch(`${baseUrl}/download/${jobId}`);

    const blob = await response.blob();

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `subtitle-${jobId}.mp4`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);

    return true
}

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});

socket.on("progress", async ({ jobId, progress }) => {

    const job = jobs.get(jobId);

    if (!job) {
        return;
    }

    const status = STATUS[progress];

    job.statusElement.innerHTML = `
        ${status}
        ${progress !== 3
            ? '<span class="dots"></span>'
            : ""
        }
    `;

    if (progress === 3) {
        job.saveButton.disabled = false;

        job.saveButton.addEventListener(
            "click",
            async () => {
                await downloadResult(jobId);

                job.element.remove();
                jobs.delete(jobId);

            },
            { once: true }
        );
    }
});