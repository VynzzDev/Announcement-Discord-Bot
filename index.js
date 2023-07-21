// IMPORT MODULE
const fs = require("node:fs");
const path = require("node:path"); 
require("dotenv").config(); 
const { Client, Intents, Routes, REST, GatewayIntentBits, Collection, ActivityType, EmbedBuilder } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences
    ]
});
const config = require("./config.json");

// LOAD SLASH COMMAND
const slash = [];
client.slash = new Collection();
const slashPath = path.join(__dirname, "slash");
const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"));
for(const count of slashFiles){
    const filePath = path.join(slashPath, count);
    const command = require(filePath);

    try{
        client.slash.set(command.data.name, command);
        slash.push(command.data.toJSON());   
        console.log(`✅ Loaded Slash Command: ${command.data.name}`);
    }catch(error){

    };
};

// INTERACTION CREATE
client.on("interactionCreate", async(interaction) => {
    if(!interaction.isCommand()) return;
    const command = client.slash.get(interaction.commandName);
    if(!command) return;
    try{
        if(!interaction.inGuild()) return interaction.reply({ content:"You can't run command in DMs!", ephemeral: true });
        await command.run(client, interaction);
    }catch(error){
        interaction.reply({ content:"An error occured while executing this command. Please try again later", ephemeral: true });
        console.log(`New Error While Executing Command: `, error);
    };
});

// REGISTRY COMMAND
client.on("ready", () => {
    client.user.setActivity({ name:`${config["activity-message"] || "Made by itzlynnn"}`, type: ActivityType.Competing });
    client.user.setStatus("online");
    const rest = new REST({ version: "10" }).setToken(token);
    (async() => {
        try{
            console.log(`🔃 Starting refreshing ${slash.length} application (/) commands`);
            rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
                body: slash
            });
            console.log(`✅ Successfully reloaded ${slash.length} application (/) commands`);
        }catch(error){
            console.log("❌ Failed refreshing application (/) commands");
        };
    })();
    console.log(`⚒️  Logged as ${client.user.tag}`);
});

// LOGIN BOT
const token = process.env.TOKEN;
if(!token){
    console.log("The discord token is not found in .env, maybe forget to add or invalid variable name?");
    process.exit();    
};
client.login(token).catch(error => {
    console.log("The discord token is invalid. Maybe wrong token or the token has been revoked");
    process.exit();
});