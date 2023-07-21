const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("announce")
        .setDescription("Make an announcement")
        .addStringOption(option => option.setName("message").setDescription("The message of Announcement. Use {line} for next line").setRequired(true))
        .addRoleOption(option => option.setName("role").setDescription("The role will mention when this message posted"))
        .addChannelOption(option => option.setName("channel").setDescription("The channel will sent the Announcemenet").addChannelTypes(ChannelType.GuildText)),
    run: async(client, interaction) => {
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
            return interaction.reply({ content:"`❌` You don't have permission to use this command", ephemeral: true });
        }
        let message = interaction.options.getString("message").replace(/{line}/g, `\n`);;
        let role = interaction.options.getRole("role");
        let channel = interaction.options.getChannel("channel");
        let embed = new EmbedBuilder()
            .setTitle("Announcement")
            .setDescription(`${message}`)
            .setTimestamp()
            .setColor("Green")
        if(role && channel){
            embed.setFooter({ text:`${interaction.user.tag}`, iconURL:`${interaction.user.displayAvatarURL()}`})
            channel.send({ embeds: [embed], content:`${role}`});
            interaction.reply("Your announcement has been posted");
        }else if(!role && channel){
            embed.setFooter({ text:`${interaction.user.tag}`, iconURL:`${interaction.user.displayAvatarURL()}`})
            channel.send({ embeds: [embed] });
            interaction.reply("Your announcement has been posted");
        }else if(!role && !channel){
            embed.setFooter({ text:`${interaction.user.tag}`, iconURL:`${interaction.user.displayAvatarURL()}`})
            interaction.channel.send({ embeds: [embed] });
            interaction.reply({ content:"Your announcement has been posted", ephemeral: true });
        }else if(role && !channel ){
            embed.setFooter({ text:`${interaction.user.tag}`, iconURL:`${interaction.user.displayAvatarURL()}`})
            interaction.channel.send({ embeds: [embed], content:`${role}`});
            interaction.reply({ content:"Your announcement has been posted", ephemeral: true });
        }
    }
}