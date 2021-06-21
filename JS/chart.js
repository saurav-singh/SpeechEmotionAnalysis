// Global Variable
let Data = {};
let Config = {};

const setup_chart = (labels, values) => {
    // labels example: ["Happy","Sad","Anxious","Neutral"]
    // values example: [75, 2, 3, 20]
    Data = {
        labels: labels,

        datasets: [{
            label: 'Emotion Level %',
            data: values,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
        }]
    };

    config = {
        type: 'radar',
        data: Data,
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        },
    };
}

const render_chart = () => {
    let context = document.getElementById("result_chart");
    new Chart(context, config);
}