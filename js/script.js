// poll-widget.js

class PollWidget {
    constructor(pollContainerId, question, options) {
        this.pollContainerId = pollContainerId;
        this.question = question;
        this.options = options;
        this.storageKey = `poll-${pollContainerId}`;
        this.init();
    }

    init() {
        const pollContainer = document.getElementById(this.pollContainerId);
        if (!pollContainer) return;

        pollContainer.innerHTML = this.renderPoll();
        this.bindEvents();
        this.loadResults();
    }

    renderPoll() {
        let optionsHtml = this.options.map((option, index) => `
            <label class="container-check poll-option">
                <label for="${this.pollContainerId}-option-${index}">${option.text}</label>
                <input type="radio" id="${this.pollContainerId}-option-${index}" name="poll-option-${this.pollContainerId}" value="${index}">
                <span class="checkmark"></span>
            </label>
        `).join('');

        return `
            <div class="poll-question">${this.question}</div>
            <div class="poll-options">${optionsHtml}</div>
            <button class="poll-vote-button btn">Vote</button>
            <div class="poll-results"></div>
            <div class="poll-responses">
                <p class="mb-0"><span class="responses-poll"></span> Responses</p>
            </div>
            <div class="submit text-center">
                <img src="./image/form-submit.gif" alt="form-submit" class="img-fluid">
                <h3>Your response has been recorded !!!!</h3>
            </div>
        `;
    }

    bindEvents() {
        const voteButton = document.querySelector(`#${this.pollContainerId} .poll-vote-button`);
        voteButton.addEventListener('click', () => this.handleVote());
    }

    handleVote() {
        const selectedOption = document.querySelector(`#${this.pollContainerId} input[name="poll-option-${this.pollContainerId}"]:checked`);
        if (selectedOption) {
            const optionIndex = parseInt(selectedOption.value, 10);
            this.saveVote(optionIndex);
            this.loadResults();
            this.showSubmissionMessage();
        }
    }

    saveVote(optionIndex) {
        const results = JSON.parse(localStorage.getItem(this.storageKey)) || new Array(this.options.length).fill(0);
        results[optionIndex] += 1;
        localStorage.setItem(this.storageKey, JSON.stringify(results));
    }

    loadResults() {
        const results = JSON.parse(localStorage.getItem(this.storageKey)) || new Array(this.options.length).fill(0);
        const totalVotes = results.reduce((sum, votes) => sum + votes, 0);
        const maxVotes = Math.max(...results);

        let resultsHtml = this.options.map((option, index) => {
            const voteCount = results[index];
            const percentage = totalVotes ? (voteCount / totalVotes * 100).toFixed(2) : 0;
            const highestVoteClass = voteCount === maxVotes && totalVotes > 0 ? 'highest-vote' : '';
            return `
                <div class="poll-result ${highestVoteClass}">
                    <div class="poll-result-text">${option.text}</div>
                    <div class="poll-result-bar-container">
                        <div class="poll-result-bar" style="width: ${percentage}%;"></div>
                    </div>
                    <div class="poll-result-percentage">${percentage}% (${voteCount} votes)</div>
                </div>
            `;
        }).join('');

        document.querySelector(`#${this.pollContainerId} .poll-results`).innerHTML = resultsHtml;
        document.querySelector(`#${this.pollContainerId} .responses-poll`).innerText = totalVotes;
    }

    showSubmissionMessage() {
        const submissionMessage = document.querySelector(`#${this.pollContainerId} .submit`);
        if (submissionMessage) {
            submissionMessage.classList.add('visible');
            setTimeout(() => {
                submissionMessage.classList.remove('visible');
            }, 3000); // Hide after 3 seconds
        }
    }
}

// Initialize poll widgets
document.addEventListener('DOMContentLoaded', () => {
    new PollWidget('poll1', 'How do you feel today?', [
        { text: 'Brilliant! I have so much energy' },
        { text: 'Always can be worse.' },
        { text: 'Please, end my misery.' }
    ]);

    new PollWidget('poll2', 'How do you like the Opinary test?', [
        { text: 'It was great and so challenging.' },
        { text: 'Not bad, but you can improve.' },
        { text: 'It was a nightmare, never again' }
    ]);

});
